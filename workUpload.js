
function readFile(file) {
    return new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result)
        };
        reader.readAsDataURL(file);
    })
}

function readFolder() {
    document.body.insertAdjacentHTML('beforeEnd', '<input style="display: none" type="file" id="ctrl" webkitdirectory directory multiple/>')
    document.getElementById('ctrl').click()
    var totalFiles = [

    ]
    document.getElementById('ctrl').oninput = async function(e) {
        var files = document.getElementById('ctrl').files
        var pathMain = undefined
        var pathHighest = 0
        for (var file in files) {
            if (files[file].webkitRelativePath != undefined) {
                if (files[file].webkitRelativePath.includes("RobloxCustom/instance/")) {
                    if (Number(files[file].webkitRelativePath.split("RobloxCustom/instance/")[1].split("x/")[0]) > pathHighest) {
                        pathHighest = Number(files[file].webkitRelativePath.split("RobloxCustom/instance/")[1].split("x/")[0])
                        pathMain = files[file].webkitRelativePath.split("x/")[0] + 'x/'
                    }
                }
            }
        }
        console.log(pathMain)
        if (pathMain == undefined) {
            alert("failed")
            return
        }
        var otherPathMain = undefined
        var otherPathHighest = 0
        for (var file in files) {
            if (files[file].webkitRelativePath != undefined) {
                if (files[file].webkitRelativePath.includes(pathMain)) {
                    if (Number(files[file].webkitRelativePath.split(pathMain)[1].split("/")[0]) > otherPathHighest) {
                        otherPathHighest = Number(files[file].webkitRelativePath.split(pathMain)[1].split("/")[0])
                        otherPathMain = pathMain + files[file].webkitRelativePath.split(pathMain)[1].split("/")[0] + '/'
                    }
                }
            }
        }
        if (otherPathMain == undefined) {
            alert("failed")
            return
        }
        console.log(otherPathMain)
        for (var file in files) {
            if (files[file].webkitRelativePath != undefined) {
                if (files[file].webkitRelativePath.includes(otherPathMain)) {
                    
                    totalFiles.push({
                        instance: files[file].webkitRelativePath.split(otherPathMain)[1].split(".png")[0],
                        value: await readFile(files[file])
                    })
                }
            }
        }
        const dataBase = window.indexedDB.open('roeditor-image-store', 1);
        dataBase.onupgradeneeded = function(event) {
            var db = event.target.result;
            const objectStore = db.createObjectStore("images", { keyPath: "instance" });
            objectStore.transaction.oncomplete = (event) => {
                const customerObjectStore = db
                    .transaction("images", "readwrite")
                    .objectStore("images");
                totalFiles.forEach((file) => {
                    customerObjectStore.add(file);
                });
            };
            console.log('stored')
            dataBase.close()
        };
        dataBase.onsuccess = (event) => {
        };

        document.getElementById('ctrl').remove()
    }
    document.getElementById('ctrl').oncancel = function() {
        document.getElementById('ctrl').remove()
    }
}
readFolder()

function fetchStoredImages() {
  const dataBase = window.indexedDB.open('roeditor-image-store', 1);
  dataBase.onsuccess = function (e) {
      var db = e.target.result
      const transaction = db.transaction(["images"], 'readonly');
      const objectStore = transaction.objectStore("images")
      objectStore.getAll().onsuccess = (event) => {
          console.log(event.target.result)
      }
  }
}
