function ajaxGet(url, callback, withToken= true) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    if(withToken){
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

            if (withToken && xhr.status === 401) {
                window.location.href = 'login.html'
            }

            if (xhr.status === 200) {
                callback(null, xhr.responseText);
            } else {
                callback(`Fehler ${xhr.status}`, null);
            }
        }
    };

    xhr.send();
}

function ajaxPost(url, data, callback, withToken= true) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    if(withToken){
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

            if (withToken && xhr.status === 401) {
                window.location.href = 'login.html'
            }

            if (xhr.status === 200) {
                callback(null, xhr.responseText);
            } else {
                callback(`Fehler ${xhr.status}`, null);
            }
        }
    };

    xhr.send(JSON.stringify(data));
}
