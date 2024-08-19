import html2Canvas from 'html2canvas';

const getJpeg = dom => {
    return new Promise(resolve => {
        html2Canvas(dom).then(canvas => {
            const jpeg = canvas.toDataURL('image/jpeg', 1.0);
            // resolve(new Blob([jpeg]));
            resolve(base64ToFile(jpeg));
        });
    });
};
// base64转化为file文件
const base64ToFile = urlData => {
    const arr = urlData.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bytes = atob(arr[1]);
    let n = bytes.length;
    const ia = new Uint8Array(n);
    while (n--) {
        ia[n] = bytes.charCodeAt(n);
    }
    return new File([ia], 'jpeg', { type: mime });
};

export default getJpeg;