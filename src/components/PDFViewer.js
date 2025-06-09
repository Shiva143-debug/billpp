import React from 'react';
import { Document, Page } from 'react-pdf';

const PDFViewer = ({ filePath }) => {
    return (
        <div>
            <Document file={filePath}>
                <Page pageNumber={1} />
            </Document>
        </div>
    );
};

export default PDFViewer;
