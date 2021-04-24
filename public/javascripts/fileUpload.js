FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    dropOnPage: true,
    dropOnElement: false,
    imageResizeTargetWidth: 600,
})

FilePond.parse(document.body);