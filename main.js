// clipboard code i think from stack overflow
function fallbackCopyTextToClipboard (text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard (text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}
// snackbar code from w3schools
function snack (text) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerText = text;
    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}
// jackbar code by myself
var list = []; // init the list
if (localStorage.getItem("history")) { // if it's saved
    list = JSON.parse(localStorage.getItem("history")); // replace the list with the save
    list.forEach(element => { // However, that last line doesn't ADD them to the page. For each html in the array...
        var loading = document.createElement("div"); // Make a div
        loading.innerHTML = element; // Change it's html to the element
        document.body.appendChild(loading); // Add it to the page
    });
} else {
    localStorage.setItem("history", JSON.stringify(list));
}
function handleEnter (e) { // on every key press
    var keycode = (e.keyCode ? e.keyCode : e.which); // keycode is the code for what they pressed
    if (keycode == '13') { // if enter was pressed
        document.getElementById("command").blur();
        var input = document.getElementById("command").value; // set input to what they typed
        document.getElementById("command").value = ""; // reset the box's text
        if (input.startsWith("roblox ") && input.length > 7) { // if they said roblox
            var roblox = document.createElement("div"); // create the base
            var image = document.createElement("img"); // create the image
            image.src = "https://www.roblox.com/Thumbs/Avatar.ashx?x=420&y=420&username=" + encodeURIComponent(input.replace("roblox ", "")); // change the image to the url for the avatar
            roblox.appendChild(image); // add the image to the base
            var name = document.createElement("p") // make the avatar's name
            name.innerText = input.replace("roblox ", "") + "'s Avatar"; // change the text to "Example's Avatar"
            roblox.appendChild(name); // add the name to the base
            document.body.appendChild(roblox); // add the base (including this other stuff) to the body 
            list.push(roblox.outerHTML);
            localStorage.setItem("history", JSON.stringify(list));
        } else if (input.startsWith("ping ") && input.length > 5) { // if they used ping
            var time = document.createElement("div"); // Make the ping element
            time.style.textAlign = "center";
            time.innerText = "Pinging " + input.replace("ping ", "") + "..."; // say "Pinging example.com..."
            document.body.appendChild(time); // Add it to the body
            ping("//" + input.replace("ping ", "").replace("^https?:\/\/(.*)", "")).then(function (delta) { // Actually ping and remove the http/https and replace that with //
                time.innerText = "Pinged " + input.replace("ping ", "") + "\nTook " + String(delta) + " ms"; // Once it's pinged, replace the text with "Pinged example.com\nTook 2 ms"
                list.push(time.outerHTML);
                localStorage.setItem("history", JSON.stringify(list));
            }).catch(function (err) { // if it errors
                console.error('Could not ping remote URL', err); // log that shit
            });
        } else if (input.startsWith("r/") && input.length > 2) { // if they used r/
            window.location.href = "https://reddit.com/" + input.replace(" ", "_"); // go to the subreddit
        } else if (input.startsWith("embed") && input.length > 6) { // if they used embed
            var ele = document.createElement("iframe"); // make an iframe
            if (input.replace("embed ", "").startsWith("https://")) { // if they put https
                ele.src = input.replace("embed ", ""); //  set the link to it
            } else { // if they forgot
                ele.src = "https://" + input.replace("embed ", ""); // add it for them
            }
            ele.width = "0"; // set the width to zero (there's an animation in the css)
            ele.height = "0"; // same
            document.body.appendChild(ele); // add it to the page
            list.push(ele.outerHTML); // add to the history
            localStorage.setItem("history", JSON.stringify(list)); // save
        } else if (input.startsWith("history")) { // if they ask for their command history
            if (input == "history") {
                if (localStorage.getItem("history")) {
                    copyTextToClipboard(localStorage.getItem("history"));
                } else {
                    copyTextToClipboard("[]");
                }
                snack("History copied to clipboard!");
            }
            if (input == "history clear") {
                localStorage.clear();
                Array.from(document.getElementsByTagName("div")).forEach(element => {
                    element.remove();
                });
                Array.from(document.getElementsByTagName("iframe")).forEach(element => {
                    element.remove();
                });
                snack("History cleared.");
            }
        } else if (input == "help" || input == "?") {
            alert(`
            JackBar commands:
            ping (url) :: Pings an IP or an address
            roblox (username) :: Shows the avatar of that user
            embed (url) :: Embeds the url
            r/(subreddit) :: Redirects you to the subreddit
          `)  
        } else { // if the command doesn't exist
            clearTimeout(stop); // remove the timeout from the end so it doesn't end early
            document.getElementById("command").classList.add("apply-shake"); // add the red
            var stop = setTimeout(() => document.getElementById("command").classList.remove("apply-shake"), 830); // after 0.83 seconds, remove it
        } // close this fucking huge if block
    } // this one too
} // end the function