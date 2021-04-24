FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
    FilePondPluginFileValidateSize,
    FilePondPluginImageValidateSize
)

FilePond.setOptions({
    dropOnPage: true,
    dropOnElement: false,
    imageResizeTargetWidth: 600,
    imageValidateSizeMaxHeight: 5000,
    imageValidateSizeMaxWidth: 5000,
    allowImageValidateSize: true,
    allowPaste: true,
    maxFileSize: '10MB',
    labelIdle: 	'Paste or Drag & Drop your image or <span class="filepond--label-action"> Browse </span>'
})

FilePond.parse(document.body);