FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    dropOnPage: true,
    dropOnElement: false,
    imageResizeTargetWidth: 500,
})

FilePond.parse(document.body);