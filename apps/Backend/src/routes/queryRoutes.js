import { Router } from 'express';
import mongoose from 'mongoose';
import Notification from '../schema/notification/notificationSchema.js';
import Query from '../schema/query/querySchema.js';
import asyncHandler from '../utils/asyncHandler.js';
import  authVerify  from '../middlewares/auth.middlewares.js';
import Admin from '../schema/admin/adminSchema.js';
import User from '../schema/userSchema.js';
import StudentService from '../services/student/studentService.js';

const studentService = new StudentService();

const queryRouter = Router();

// Apply auth middleware to all routes
queryRouter.use(authVerify);

// Student routes
queryRouter.post('/', asyncHandler(async (req, res) => {
  try {
    const { subject, description, category } = req.body;
    if (!subject || !description || !category) {
      return res.status(400).json({
        message: 'Missing required fields: subject, description, and category are required'
      });
    }

    const query = await Query.create({
      subject,
      description,
      category,
      priority: req.body.priority || 'medium',
      student: req.user._id, // Now req.user will be available
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: query
    });
  } catch (error) {
    console.error('Query creation error:', error);
    res.status(500).json({
      message: 'Failed to create query',
      error: error.message
    });
  }
}));

queryRouter.get('/student', asyncHandler(async (req, res) => {
  try {
    // Add logging to debug
    console.log('Fetching queries for student:', req.user._id);

    const queries = await Query.find({ student: req.user._id })
      .sort('-createdAt')
      .populate('responses.respondedBy', 'name email')
      .lean();

    // Add logging for results
    console.log('Found queries:', queries.length);

    res.status(200).json({
      success: true,
      data: queries,
      count: queries.length
    });
  } catch (error) {
    console.error('Error fetching student queries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch queries',
      error: error.message
    });
  }
}));

// Admin routes
queryRouter.get('/admin/queries', asyncHandler(async (req, res) => {
  try {
    // Get all queries
    const queries = await Query.find()
      .populate({
        path: 'student',
        select: '_id email',
        model: 'User'
      })
      .sort('-createdAt')
      .lean();

    // Debug log queries
    console.log('Raw queries:', JSON.stringify(queries, null, 2));

    // Get unique student IDs
    const studentIds = [...new Set(queries.map(q => q.student?._id))];

    // Get student details with both User and Student info
    const studentDetailsPromises = studentIds.map(async (studentId) => {
      const [studentResponse, userDetails] = await Promise.all([
        studentService.getStudentByUserId(studentId),
        User.findById(studentId).select('email').lean()
      ]);

      // Debug log individual student details
      console.log(`Student ${studentId} details:`, {
        response: studentResponse,
        user: userDetails
      });

      return {
        userId: studentId,
        email: userDetails?.email,
        details: studentResponse.data || null
      };
    });

    const studentDetails = await Promise.all(studentDetailsPromises);

    // Create lookup map combining both User and Student data
    const studentMap = studentDetails.reduce((acc, student) => {
      if (student.userId) {
        acc[student.userId] = {
          email: student.email,
          personalInfo: student.details?.personalInfo || {}
        };
      }
      return acc;
    }, {});

    const formattedQueries = queries.map(query => {
      const studentInfo = studentMap[query.student?._id];
      
      return {
        id: query._id,
        name: studentInfo?.personalInfo?.name || 'Unknown',
        email: studentInfo?.email || 'No email',
        rollNo: studentInfo?.personalInfo?.rollNumber || 'N/A',
        subject: query.subject,
        description: query.description,
        category: query.category,
        priority: query.priority,
        status: query.status,
        createdAt: query.createdAt,
        responses: query.responses || [],
        reviewed: query.status !== 'pending'
      };
    });

    // Debug log final formatted queries
    console.log('Formatted queries:', JSON.stringify(formattedQueries, null, 2));

    res.json({
      success: true,
      data: formattedQueries
    });
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch queries',
      error: error.message
    });
  }
}));

queryRouter.post('/:id/respond', asyncHandler(async (req, res) => {
  try {
    // First find the query and properly populate student
    const query = await Query.findById(req.params.id);
    
    if (!query) {
      return res.status(404).json({ 
        success: false, 
        message: 'Query not found' 
      });
    }

    // Check if student exists
    if (!query.student) {
      return res.status(400).json({
        success: false,
        message: 'Query has no associated student'
      });
    }

    // Verify admin permissions
    if (req.user.user_role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only admins can respond to queries' 
      });
    }

    // Add response
    const updatedQuery = await Query.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          responses: {
            message: req.body.message,
            respondedBy: req.user._id,
            createdAt: new Date()
          }
        },
        $set: { status: 'resolved' }
      },
      { new: true }
    ).populate('responses.respondedBy', 'email');

    // Create notification
    const notification = await Notification.create({
      type: 'academic',
      title: 'Query Response Received',
      message: `Admin has responded to your query: ${query.subject}`,
      date: new Date(),
      isRead: false,
      user: query.student, // Use the student ID directly
      queryId: query._id
    });

    // Send websocket notification if available
    if (req.app.get('io')) {
      req.app.get('io').to(`student-${query.student}`).emit('notification', {
        ...notification.toObject(),
        type: 'queryResponse'
      });
    }

    console.log('Successfully created notification:', notification);

    res.json({
      success: true,
      data: updatedQuery,
      notification
    });

  } catch (error) {
    console.error('Error responding to query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to respond to query',
      error: error.message
    });
  }
}));

// Add this route with your other routes
queryRouter.put('/:id', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const query = await Query.findById(id);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    // Check if user owns this query
    if (query.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this query'
      });
    }

    // Update specific fields only
    query.subject = updates.subject;
    query.description = updates.description;
    query.category = updates.category;
    query.priority = updates.priority;

    // Initialize updates array if it doesn't exist
    if (!query.updates) {
      query.updates = [];
    }

    // Add the update record
    query.updates.push({
      from: 'Student',
      message: `Query updated `,
      //- Changed: ${Object.keys(updates).join(', ')}
      timestamp: new Date()
    });

    // Save the updated document
    const updatedQuery = await query.save();

    // Return the populated query
    const populatedQuery = await Query.findById(updatedQuery._id)
      .populate('responses.respondedBy', 'name email')
      .lean();

    res.json({
      success: true,
      data: populatedQuery
    });
  } catch (error) {
    console.error('Query update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update query',
      error: error.message
    });
  }
}));

export default queryRouter;