// Set of functions that wll be used through application

export const afCapitalize = (str: string) => {
    let _:string[] = []
    str.split(' ').forEach(w => _.push(w.charAt(0).toUpperCase() + w.slice(1)))
    return _.join(' ')
}