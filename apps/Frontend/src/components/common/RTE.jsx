import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function RTE(setMessage) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <>
      <Editor
        apiKey='aplsj1wh83umufb21rl4ufh8o0t03y4cqikkzmfps382mupk'
        onInit={(_evt, editor) => editorRef.current = editor}
        initialValue=""
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        }}
        onChange={(e) => setMessage(e.target.getContent())
        }
      />
      <button onClick={log}>Log editor content</button>
    </>
  );
}