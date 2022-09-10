type DownloadableProps = {
    filename?: string,
    url: string
}

const downloadable = ({filename = "", url}: DownloadableProps) => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', url);
    anchor.setAttribute('download', filename); 
    anchor.style.display = 'none';
    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);
}

export default downloadable