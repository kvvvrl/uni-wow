function ajaxGet(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(null, xhr.responseText);
            } else {
                callback(`Fehler ${xhr.status}`, null);
            }
        }
    };

    xhr.send();
}