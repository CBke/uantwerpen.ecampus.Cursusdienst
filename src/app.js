const {
    ActivityIndicator,
    CollectionView,
    Composite,
    ImageView,
    NavigationView,
    Page,
    ScrollView,
    Tab,
    TabFolder,
    TextView,
    LocalStorage,
    ui
} = require("tabris");

const ShowScreen = (response) => {

    let navigationView = new NavigationView({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }).appendTo(ui.contentView);
    response.Page = MenuTab(response, navigationView);
    response.Page.appendTo(navigationView);

}

const MenuTab = (datanode, navigationView) => {
    let page = new Page({
        title: datanode.Title,
        autoDispose: false
    });
    let scrollView1 = new ScrollView({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }).appendTo(page);
    new CollectionView({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        itemCount: datanode.Items.length,
        createCell: () => {
            let cell = new Composite().on("tap", ({
                target
            }) => {
                let DataPointer = datanode.Items[target.idx];
                if (!DataPointer.hasOwnProperty("Page")) {
                    if (DataPointer.hasOwnProperty("Items")) {
                        DataPointer.Page = MenuTab(DataPointer, navigationView)
                    } else {
                        DataPointer.Page = DetailTab(DataPointer)
                    }
                }
                DataPointer.Page.appendTo(navigationView);
            });
            new TextView({
                id: "senderText",
                top: 16,
                left: 16,
                bottom: 16,
                right: 16,
                font: "bold 18px"
            }).appendTo(cell);
            new Composite({
                left: 0,
                bottom: 0,
                right: 0,
                height: 1,
                background: "#b8b8b8"
            }).appendTo(cell);
            return cell;
        },
        updateCell: (cell, index) => {
            cell.find("#senderText").set("text", datanode.Items[index].Item);
            cell.idx = index;
        }
    }).appendTo(scrollView1);
    return page
}

const Item = () => {
    let cell = new Composite();
    new TextView({
        id: "Nummer",
        top: 3,
        left: 16
    }).appendTo(cell);
    new TextView({
        id: "descr",
        top: 3,
        right: "#price 16",
        left: "#Nummer 16"
    }).appendTo(cell);
    new TextView({
        id: "price",
        top: 3,
        right: 16
    }).appendTo(cell);
    return cell;
}

const GroupItem = () => {
    let cell = new Composite({
        id: "sep",
        top: "prev()",
        left: 0,
        right: 0
    });
    let cell2 = new Composite({
        top: "prev() 35",
        left: 0,
        right: 0
    }).appendTo(cell);
    new TextView({
        id: "Nummer",
        top: "#sep 3",
        left: 16,
        bottom: 5,
        font: "bold 18px"
    }).appendTo(cell2);
    new TextView({
        id: "descr",
        top: "#sep 3",
        right: "#price 16",
        left: "#Nummer 16",
        font: "bold 18px"
    }).appendTo(cell2);
    new TextView({
        id: "price",
        top: "#sep 3",
        right: 16,
        font: "bold 18px"
    }).appendTo(cell2);
    new Composite({
        left: 0,
        bottom: 0,
        right: 0,
        height: 1,
        background: "#b8b8b8"
    }).appendTo(cell);
    return cell;
}

const VakItem = () => new Composite({
        right: 0,
        left: 0
    })
    .append(
        new Composite({
            right: 0,
            left: 0,
            top: "prev() 35",
            font: "bold 14px",
        }),
        new TextView({
            left: 0,
            top: "prev()",
            right: 0,
            id: "descr",
            left: 16,
            right: 8,
            alignment: "center",
        }),
        new Composite({
            right: 0,
            left: 0,
            top: "prev()",
            height: 1
        }),
        new Composite({
            left: 0,
            bottom: 0,
            right: 0,
            height: 1,
            background: "#b8b8b8"
        })
    );

const CursusItem = () => new Composite({
        top: "prev() 1",
        left: 16,
        right: 16
    })
    .append(
        new TextView({
            id: "Nummer",
            font: "bold 16px",
            top: 3,
            left: 16
        }),
        new TextView({
            id: "descr",
            font: "bold 16px",
            top: 3,
            right: "#price 16",
            left: "#Nummer 16"
        }),
        new TextView({
            id: "price",
            font: "bold 16px",
            top: 3,
            right: 16
        })
    );


const DetailTab = (datanode) => {
    let page = new Page({
        title: datanode.Item,
        autoDispose: false,
    });
    let tabFolder = new TabFolder({
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            paging: true
        })
        .appendTo(page);

    if (datanode.Bundles.length > 0) {
        new Tab({
                title: "Paketten",
                id: "Paketten",
            })
            .appendTo(tabFolder)
            .append(
                new ScrollView({
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                })
                .append(
                    new CollectionView({
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        itemCount: datanode.Bundles.length,
                        cellType: index => datanode.Bundles[index].Class,
                        createCell: (type) => type === "#c" ? Item() : GroupItem(),
                        updateCell: (cell, index) => {
                            let pakket = datanode.Bundles[index];
                            cell.find("#Nummer").set("text", pakket.Campus + " - " + pakket.Nummer);
                            cell.find("#descr").set("text", pakket.Descr);
                            cell.find("#price").set("text", "€ " + pakket.Price);
                        }
                    })
                ))

    }
    new Tab({
            title: "Cursussen"
        })
        .appendTo(tabFolder)
        .append(
            new ScrollView({
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            })
            .append(
                new CollectionView({
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    itemCount: datanode.Vakken.length,
                    cellType: index => datanode.Vakken[index].Class,
                    createCell: (type) => type === "#c" ? CursusItem() : VakItem(),
                    updateCell: (cell, index) => {
                        let pakket = datanode.Vakken[index];
                        if (datanode.Vakken[index].Class == "#c") {
                            cell.find("#Nummer").set("text", pakket.Campus + " - " + pakket.Nummer);
                            cell.find("#descr").set("text", pakket.Descr);
                            cell.find("#price").set("text", "€ " + pakket.Price);
                        } else {
                            cell.find("#descr").set("text", pakket.Name);
                        }
                    }
                })
            )
        )


    return page;
}

var formatDate = (today) => `${today.getFullYear()}/${today.getMonth()}/${today.getDate()}/${today.getHours()}`;

var key = formatDate(new Date());

var data = localStorage.getItem(key) || 'RELOAD';

if (data === 'RELOAD') {
    new ActivityIndicator({
        class: "LL",
        centerX: 0,
        bottom: 50
    }).appendTo(ui.contentView);
    new TextView({
        class: "LL",
        centerX: 0,
        centerY: 0,
        text: 'Syncing...',
        font: "bold 18px"
    }).appendTo(ui.contentView);
    localStorage.clear();
    fetch("https://cursussen.uantwerpen.be/Home/Level")
        .then(response => response.text())
        .then(response => localStorage.setItem(key, response))
        .then(response => localStorage.getItem(key))
        .then(response => JSON.parse(response))
        .then(response => ShowScreen(response))
        .then(x => ui.find('.LL').set('visible', false));

} else {
    ShowScreen(JSON.parse(data))
}
