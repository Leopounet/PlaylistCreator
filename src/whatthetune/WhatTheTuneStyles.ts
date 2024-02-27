export const addButtonClassName = "add-button";
export const removeButtonClassName = "remove-button";
export const loginButtonClassName = "login-button";
export const logoutButtonClassName = "logout-button";

/**
 * Creates a new Style Element that describes
 * a green button used to add songs to the
 * playlist.
 */
export const addButtonStyle = (): HTMLStyleElement => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
    .${addButtonClassName} {
      display: inline-block;
      width: 40px;
      height: 40px;
      margin-right: 5px;
      background-color: #006400; /* Dark green color, you can adjust the hex code */
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
    
    .${addButtonClassName}:hover {
      background-color: #008000; /* Lighter color on hover */
    }
    
    .${addButtonClassName}:active {
      background-color: #004d00; /* Darker color when clicked */
    }
`;
    return styleElement;
};

/**
 * Creates a new Style Element that describes
 * a red button used to remove songs to the
 * playlist.
 */
export const removeButtonStyle = (): HTMLStyleElement => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
.${removeButtonClassName} {
  display: inline-block;
  width: 40px;
  height: 40px;
  background-color: #8b0000;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}

.${removeButtonClassName}:hover {
  background-color: #a30000; /* Lighter color on hover */
}

.${removeButtonClassName}:active {
  background-color: #750000; /* Darker color when clicked */
}
`;
    return styleElement;
};

/**
 * Creates a new Style Element that describes
 * a green button used to log into the user's
 * Spotify's account.
 */
export const loginButtonStyle = (): HTMLStyleElement => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
  .${loginButtonClassName} {
    background-color: #006400; /* Dark purple color, you can adjust the hex code */
    border: none;
    color: white; /* Text color */
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 5px; /* Rounded corners */
  }
  
  .${loginButtonClassName}:hover {
    background-color: #008000; /* Adjusted shade for hover effect */
  }
  
  .${loginButtonClassName}:active {
    background-color: #004d00; /* Adjusted shade for active (clicked) effect */
  }
  `;
    return styleElement;
};

/**
 * Creates a new Style Element that describes
 * a red button used to log out of the user's
 * Spotify's account.
 */
export const logoutButtonStyle = (): HTMLStyleElement => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
  .${logoutButtonClassName} {
    background-color: #8b0000; /* Dark red color, you can adjust the hex code */
    border: none;
    color: white; /* Text color */
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 5px; /* Rounded corners */
  }
  
  .${logoutButtonClassName}:hover {
    background-color: #a30000; /* Adjusted shade for hover effect */
  }
  
  .${logoutButtonClassName}:active {
    background-color: #750000; /* Adjusted shade for active (clicked) effect */
  }
`;
    return styleElement;
};
