// Set of functions that wll be used through application

export const afCapitalize = (str: string) => {
    let _: string[] = []
    str.split(' ').forEach(w => _.push(w.charAt(0).toUpperCase() + w.slice(1)))
    return _.join(' ')
}

export const rgb2hex = (rgb: string) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)?.slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

export const generateUid = () => '_' + Math.random().toString(36).slice(2, 9) + Date.now()

export const formatDateTime = (milliseconds: number) => {
    const date = new Date(milliseconds);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formattedDateTime;
}
