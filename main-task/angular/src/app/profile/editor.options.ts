
// tslint:disable-next-line: typedef
export const modules = {
  toolbar: [
    ['bold', 'italic'],        // toggled buttons
    ['blockquote'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],

    [{ 'size': ['small', false, 'large'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, false] }],

    [{ 'color': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
    ['image']
  ]
};
