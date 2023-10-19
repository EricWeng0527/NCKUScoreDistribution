(function () {
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn.jsdelivr.net/gh/EricWeng0527/NCKUScoreDistribution@latest/screen.css';
    document.head.appendChild(css);

    var overlayDiv = document.createElement('div');
    overlayDiv.id = 'overlayDiv';
    overlayDiv.style.background = '#F0F0F0';
    overlayDiv.style.position = 'fixed';
    overlayDiv.style.top = '50%';
    overlayDiv.style.left = '50%';
    overlayDiv.style.transform = 'translate(-50%, -50%)';
    overlayDiv.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.2)';
    overlayDiv.style.zIndex = '9999';
    overlayDiv.style.overflowY = 'scroll';
    overlayDiv.style.padding = '10px';

    var closeButton = document.createElement('button');
    closeButton.innerHTML = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.onclick = function () {
        document.body.removeChild(overlayDiv);
    };
    overlayDiv.appendChild(closeButton);


    var table = document.querySelectorAll('table')[3];
    if (table) {
        var rows = table.querySelectorAll('tr');

        var firstRowText = rows[0].querySelector('td').innerText || rows[0].querySelector('td').textContent;
        var splitText = firstRowText.split(/\s+/);

        var year = splitText[0].slice(0, 4);
        var sem = splitText[0][4] == "上" ? 1 : 2;
        var dep = splitText[1];
        var gra = splitText[2];
        var name = splitText[3];
        var num = splitText[4];


        var Title = document.createElement('span');
        Title.innerText = "成積分布圖查詢";
        Title.style.fontWeight = 'bold';
        Title.style.fontSize = '25px';
        overlayDiv.appendChild(Title);

        var lineBreak = document.createElement('br');
        overlayDiv.appendChild(lineBreak);
        overlayDiv.appendChild(lineBreak);

        var newTable = document.createElement('table');
        newTable.style.width = '100%';
        newTable.style.background = 'white';
        newTable.style.borderCollapse = 'collapse';

        var headers = rows[1].querySelectorAll('td');
        var headerRow = newTable.insertRow();
        headerRow.style.fontWeight = 'bold';
        [0, 2, 3, 7].forEach(function (index) {
            if (headers[index]) {
                var headerCell = headerRow.insertCell();
                headerCell.innerText = headers[index].innerText || headers[index].textContent;
                headerCell.style.border = '1px solid #808080';
                if (index === 2) {
                    var classHeaderCell = headerRow.insertCell();
                    classHeaderCell.innerText = "班別";
                    classHeaderCell.style.border = '1px solid #808080';
                }
            }
        });

        var distCell = headerRow.insertCell();
        distCell.innerText = "分布圖";
        distCell.style.border = '1px solid #808080';

        for (var i = 2; i < rows.length - 2; i++) {
            var cells = rows[i].querySelectorAll('td');
            var newRow = newTable.insertRow();
            var class_name;
            var course_code;
            var class_code;
            var grade;

            [0, 2, 3, 7].forEach(function (index) {
                if (cells[index]) {
                    var newCell = newRow.insertCell();
                    var cellText = cells[index].innerText || cells[index].textContent;
                    if (index === 2) {
                        course_code = cellText.length > 7 ? cellText.substring(0, 7) : cellText;
                        class_code = cellText.length > 7 ? cellText.substring(7) : "";

                        var classCell = newRow.insertCell();
                        classCell.innerText = class_code;
                        classCell.style.border = '1px solid #808080';
                    } else if (index === 3) {
                        class_name = cellText;
                    } else if (index == 7) {
                        grade = cellText;
                    }
                    newCell.innerText = cellText;
                    newCell.style.border = '1px solid #808080';

                }
            });

            var newDistCell = newRow.insertCell();
            var link = document.createElement('a');
            link.href = "#";
            link.innerText = "顯示";

            link.onclick = (function (c_code, cl_code, class_name) {
                return function (e) {
                    e.preventDefault();


                    var existingDiv = overlayDiv.querySelector('#bottomdiv');
                    if (existingDiv) {
                        overlayDiv.removeChild(existingDiv);
                    }

                    var bottomdiv = document.createElement('div');
                    bottomdiv.id = 'bottomdiv';
                    bottomdiv.style.display = 'flex';
                    bottomdiv.style.alignItems = 'center';
                    bottomdiv.style.justifyContent = 'center';
                    bottomdiv.style.flexDirection = 'column';

                    var classLabel = document.createElement('span');
                    classLabel.innerText = class_name;
                    classLabel.style.marginBottom = '10px';
                    classLabel.style.fontWeight = 'bold';
                    classLabel.style.fontSize = '20px';
                    classLabel.style.marginTop = '10px';
                    classLabel.style.marginLeft = '10px';

                    var gradeLabel = document.createElement('div');
                    gradeLabel.innerText = '人\n數';
                    gradeLabel.style.fontWeight = 'bold';
                    gradeLabel.style.textAlign = 'center';
                    gradeLabel.style.marginBottom = '10px';

                    var img = new Image();
                    img.src = "https://qrys.ncku.edu.tw/ncku/histogram.asp?syear=" + year + "&sem=" + sem + "&co_no=" + c_code + "&class_code=" + cl_code;
                    img.alt = "分布圖";

                    var imageContainer = document.createElement('div');
                    imageContainer.style.display = 'flex';
                    imageContainer.style.alignItems = 'center';

                    var scoreLabel = document.createElement('span');
                    scoreLabel.innerText = '成績';
                    scoreLabel.style.fontWeight = 'bold';
                    scoreLabel.style.marginLeft = '15px';

                    img.onload = function () {
                        imageContainer.appendChild(gradeLabel);
                        imageContainer.appendChild(img);
                        bottomdiv.appendChild(classLabel);
                        bottomdiv.appendChild(imageContainer);
                        bottomdiv.appendChild(scoreLabel);
                        overlayDiv.appendChild(bottomdiv);
                    };

                    img.onerror = function () {
                        alert('圖片載入失敗！');
                    };
                };
            })(course_code, class_code, class_name);
            newDistCell.appendChild(link);
            newDistCell.style.border = '1px solid #808080';
        }

        overlayDiv.appendChild(newTable);
    }

    document.body.insertBefore(overlayDiv, document.body.firstChild);
})();
