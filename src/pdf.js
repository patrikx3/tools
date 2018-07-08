//const pdfjs = require('pdfjs-dist');
//const fsExtra = require('fs-extra');
const mz = require('mz');

const pdf = async(file) => {
    const buffer = await mz.fs.readFile(file);
    const doc = await pdfjs.getDocument(buffer);

    var numPages = doc.numPages;
    console.log('# Document Loaded');
    console.log('Number of Pages: ' + numPages);
    console.log();

    const meta = await doc.getMetadata()
    console.log('# Metadata Is Loaded');
    console.log('## Info');
    console.log(JSON.stringify(meta.info, null, 2));
    console.log();
    if (meta.metadata) {
        console.log('## Metadata');
        console.log(JSON.stringify(meta.metadata.metadata, null, 4));
        console.log();
    }

    for (var pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await doc.getPage(pageNum);
        console.log('# Page ' + pageNum);
        var viewport = page.getViewport(1.0 /* scale */);
        console.log('Size: ' + viewport.width + 'x' + viewport.height);
        console.log();
        const content = await page.getTextContent();

        // Content contains lots of information about the text layout and
        // styles, but we need only strings at the moment
        var strings = content.items.map(function (item) {
            return item.str;
        });
        console.log('## Text Content');
        console.log(strings.join(' '));
//        console.log(content);
    }
}

module.exports = pdf;