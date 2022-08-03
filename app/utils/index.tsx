
export const truncateText = (text: string, limit: number): string => {
  if(text?.length > limit){
    return text.trim().substring(0, limit) + '...'
  }
  return text?.trim()
}

export const isSeries = (str: string): boolean | string => {
  const title = str.trim(), regex = /—.*[0-9]/g

  if(!regex.test(title)){
    return false
  }
  const arr = str.split('—')
  return arr[arr.length - 1]
}