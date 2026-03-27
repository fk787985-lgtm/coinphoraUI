export const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true // Use 12-hour time format
    };
  
    // Create a new Date object from the dateString
    const date = new Date(dateString);
  
    // Format the date and time using toLocaleString
    const formattedDate = date.toLocaleString("en-US", options);
  
    return formattedDate;
  };
  