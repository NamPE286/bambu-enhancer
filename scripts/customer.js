function extractDate(str) {
    const arr = str.split("-");
    const res = new Date();

    res.setFullYear(arr[2]);
    res.setMonth(parseInt(arr[1]) - 1);
    res.setDate(arr[0]);

    return res;
}

async function getLastestVisitDate(cusID) {
    const HTML = await (
        await fetch(
            `https://hanquochalong.bambu.vn/default.aspx?dl=31&cusid=${cusID}`
        )
    ).text();
    const elem = document.createElement("div");
    elem.innerHTML = HTML;

    return {
        lastestVisit: extractDate(
            elem.getElementsByClassName("pad_t3")[13].innerText
        ),
    };
}

function fillDate(date) {
    document.getElementsByTagName("input")[8].value = date.toLocaleDateString(
        "VI-vn",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    );
}

const params = new URLSearchParams(window.location.search);

if (params.has("cusid") && params.has("dl") && params.get("dl") == "318") {
    const cusID = params.get("cusid");
    const elem = document.createElement("div");

    elem.style.display = "flex";
    elem.style.flexDirection = "column";
    elem.style.paddingInline = "150px";
    elem.style.fontSize = "12px";
    elem.style;

    getLastestVisitDate(cusID)
        .then((data) => {
            elem.innerHTML = `
            <div>
                <span>Lần thăm khám gần nhất: ${data.lastestVisit.toLocaleDateString(
                    "VI-vn",
                    {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }
                )}</span>
            </div>
        `;

            document.getElementsByTagName("body")[0].appendChild(elem);
            fillDate(data.lastestVisit);
        })
        .catch(() => {
            elem.innerHTML = `
            <div>
                <span>Chưa thăm khám lần nào</span>
            </div>
        `;

            document.getElementsByTagName("body")[0].appendChild(elem);
        });
}
