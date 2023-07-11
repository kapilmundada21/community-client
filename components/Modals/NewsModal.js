import dynamic from 'next/dynamic'
import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import 'react-quill/dist/quill.snow.css';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

function NewsModal({ news, handleChange }) {

  const [validationFlag, setValidationFlag] = useState(true);
  const [errorFlag, setErrorFlag] = useState(false);

  const extractContent = (s) => {
    let span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };

  const validate = (e) => {
    setValidationFlag(true);
    let text = extractContent(e);
    if (text.length >= 250) {
      setValidationFlag(false);
    }
    return e;
  }

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  }

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ]

  return (
    <Box component="div">
      {
        news &&
        <Grid
          container
          spacing={2}
          columns={{ xs: 2, sm: 6, md: 12 }}
        >
          <Grid item xs={2} sm={6} md={12}>
            <TextField
              required
              id="title"
              label="Title"
              value={news.title}
              onChange={handleChange}
              fullWidth
              inputProps={{
                maxLength: 250,
                minLength: 2,
              }}
            />
          </Grid>
          <Grid item xs={2} sm={6} md={12}>
            <QuillNoSSRWrapper
              theme="snow"
              modules={modules}
              formats={formats}
              id="description"
              name="description"
              placeholder="Description *"
              value={news.description}
              onChange={e => { news.description = validate(e) }}
              onFocus={() => setErrorFlag(true)}
              className='h-72 mb-44 md:mb-20'
            />
            {validationFlag && errorFlag ? (<p className="text-red-600 text-sm">please enter news description with minimum 250 character</p>) : null}
          </Grid>
          <Grid item xs={2} sm={6} md={6}>
            <TextField
              required
              id="img"
              label="Image URL"
              value={news.img}
              onChange={handleChange}
              fullWidth
              inputProps={{
                maxLength: 150,
                minLength: 2,
              }}
            />
          </Grid>
          <Grid item xs={2} sm={6} md={6}>
            <TextField
              required
              id="publishedBy"
              label="Published By"
              value={news.publishedBy}
              onChange={handleChange}
              fullWidth
              inputProps={{
                maxLength: 50,
                minLength: 2,
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      }
    </Box>
  );
}

export default NewsModal;
