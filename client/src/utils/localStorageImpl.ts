


export const localStorageSetItem = (key:string , value : string) =>{
    localStorage.setItem(key , value);
    return
}
export const localStorageGetItem = (key:string) : string | null =>{
    return  localStorage.getItem(key);
}
export const localStorageRemoveItem = (key:string)  =>{
    localStorage.removeItem(key);
    return
}

