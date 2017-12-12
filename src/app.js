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
    ui
} = require("tabris");



let status = new TextView({
    class: "LL",
    centerX: 0,
    centerY: 0,
    text: 'Syncing...',
    font: "bold 18px"
}).appendTo(ui.contentView);

function toFlatlist(Pakket) {
    let t = Pakket.Cursussen.map(Cursus => {
        return {
            Type: "Cursus",
            Nummer: Cursus.Nummer,
            Descr: Cursus.Descr,
            Price: Cursus.Price,
            Campus: Cursus.Campus
        };
    });
    t.unshift({
        Type: "Pakket",
        Nummer: Pakket.Nummer,
        Descr: Pakket.Descr,
        Price: Pakket.Price,
        Campus: Pakket.Campus
    });
    return t;
}

function toFlatlistVak(Vak) {
    let t = Vak.Cursussen.map(Cursus => {
        return {
            Type: "Cursus",
            Nummer: Cursus.Nummer,
            Descr: Cursus.Descr,
            Price: Cursus.Price,
            Campus: Cursus.Campus
        };
    });
    t.unshift({
        Type: "Vak",
        Descr: Vak.Name
    });
    return t;
}



function MenuTab(datanode, navigationView) {

    let page = new Page({
        title: datanode.Title,
        autoDispose: false
    });

    let scrollView1 = new ScrollView({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }).appendTo(page)

    new CollectionView({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        itemCount: datanode.Items.length,
        createCell: () => {
            let cell = new Composite()
                .on("tap", ({
                    target
                }) => {
                    if (!datanode.Items[target.idx].hasOwnProperty("Page")) {
                        if (datanode.Items[target.idx].hasOwnProperty("Items")) {
                            datanode.Items[target.idx].Page = MenuTab(datanode.Items[target.idx], navigationView)
                        } else {
                            datanode.Items[target.idx].BundlesAll = [];
                            datanode.Items[target.idx].VakkenAll = [];
                            if (datanode.Items[target.idx].Bundles.length != 0) {

                                datanode.Items[target.idx].BundlesAll = datanode.Items[target.idx].Bundles.map(x => toFlatlist(x)).reduce(function(a, b) {
                                    return a.concat(b);
                                });
                            }

                            if (datanode.Items[target.idx].Vakken.length !== 0) {

                                datanode.Items[target.idx].VakkenAll = datanode.Items[target.idx].Vakken.map(x => toFlatlistVak(x)).reduce(function(a, b) {
                                    return a.concat(b);
                                });
                            }
                            datanode.Items[target.idx].Page = DetailTab(datanode.Items[target.idx])
                        }
                    }
                    datanode.Items[target.idx].Page
                        .appendTo(navigationView);
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
            let vak = datanode.Items[index];
            cell.find("#senderText").set("text", vak.Item);
            cell.idx = index;
        }
    }).appendTo(scrollView1);

    return page
}

function Item() {

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

function GroupItem() {

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

function VakItem() {

    let cell = new Composite({
        right: 0,
        left: 0,
    });

    new Composite({
        right: 0,
        left: 0,
        top: "prev() 35",
        font: "bold 14px",
    }).appendTo(cell);

    new TextView({
        left: 0,
        top: "prev()",
        right: 0,
        id: "descr",
        left: 16,
        right: 8,
        alignment: "center",
    }).appendTo(cell);

    let cellline = new Composite({
        right: 0,
        left: 0,
        top: "prev()",
        height: 1
    }).appendTo(cell);

    new Composite({
        left: 0,
        bottom: 0,
        right: 0,
        height: 1,
        background: "#b8b8b8"
    }).appendTo(cell);

    return cell;
}

function CursusItem() {

    let cell = new Composite({
        top: "prev() 1",
        left: 16,
        right: 16,
    })

    new TextView({
        id: "Nummer",
        top: 3,
        left: 16,
        font: "bold 16px"
    }).appendTo(cell);

    new TextView({
        id: "descr",
        top: 3,
        right: "#price 16",
        left: "#Nummer 16",
        font: "bold 16px"
    }).appendTo(cell);

    new TextView({
        id: "price",
        top: 3,
        right: 16,
        font: "bold 16px"
    }).appendTo(cell);

    return cell;
}

function DetailTab(datanode) {

    let page = new Page({
            title: datanode.Item,
            autoDispose: false,
        })
        .on("appear", () => {
            if (datanode.NumerOfBundles === undefined || datanode.NumerOfBundles === null || datanode.NumerOfBundles === 0) {
                ui.find("#Paketten").first().visible = false
            }
        });

    let tabFolder = new TabFolder({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        paging: true
    }).appendTo(page);

    let Pakkettab = new Tab({
        title: "Paketten",
        id: "Paketten",
    }).appendTo(tabFolder);

    let scrollView1 = new ScrollView({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }).appendTo(Pakkettab);

    new CollectionView({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        itemCount: datanode.BundlesAll.length,
        cellType: index => datanode.BundlesAll[index].Type,
        createCell: (type) => type === "Cursus" ? Item() : GroupItem(),
        updateCell: (cell, index) => {
            let pakket = datanode.BundlesAll[index];
            cell.find("#Nummer").set("text", /*pakket.Campus + */ pakket.Nummer);
            cell.find("#descr").set("text", pakket.Descr);
            cell.find("#price").set("text", "€ " + pakket.Price);
        }
    }).appendTo(scrollView1);

    let Cursussentab = new Tab({
        title: "Cursussen"
    }).appendTo(tabFolder);

    let scrollView2 = new ScrollView({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }).appendTo(Cursussentab);

    new CollectionView({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        itemCount: datanode.VakkenAll.length,
        cellType: index => datanode.VakkenAll[index].Type,
        createCell: (type) => type === "Cursus" ? CursusItem() : VakItem(),
        updateCell: (cell, index) => {

            let pakket = datanode.VakkenAll[index];
            if (datanode.VakkenAll[index].Type == "Cursus") {
                cell.find("#Nummer").set("text", /*pakket.Campus +*/ pakket.Nummer);
                cell.find("#descr").set("text", pakket.Descr);
                cell.find("#price").set("text", "€ " + pakket.Price);
            } else {
                cell.find("#descr").set("text", pakket.Descr);
            }
        }
    }).appendTo(scrollView2);

    return page;
}

function RemoveEmptyNodes(js) {
    // if traversing 4 levels deep is possible, mark whole path as true
    js.Items.map((item0) => {
        item0.Items.map((item1) => {
            item1.Items.map((item2) => {
                item2.Items.map((item3) => {
                    item3.marked = true;
                    item2.marked = true;
                    item1.marked = true;
                    item0.marked = true;
                });
            });
        });
    });
    // traversing 4 levels deep delete the not marked ones on the way
    for (var i = js.Items.length - 1; i >= 0; i--) {
        if (!js.Items[i].marked) {
            js.Items.splice(i, 1);
        } else {
            for (var j = js.Items[i].Items.length - 1; j >= 0; j--) {
                if (!js.Items[i].Items[j].marked) {
                    js.Items[i].Items.splice(j, 1);
                } else {
                    for (var k = js.Items[i].Items[j].Items.length - 1; k >= 0; k--) {
                        if (!js.Items[i].Items[j].Items[k].marked) {
                            js.Items[i].Items[j].Items.splice(k, 1);
                        }
                    }
                }
            }
        }
    }
}

fetch("http://cursussen.uantwerpen.be/Home/Level")
    .then(response => response.json())
    .then((json) => {

        RemoveEmptyNodes(json);
        let navigationView = new NavigationView({
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            })
            .appendTo(ui.contentView);


        json.Page = MenuTab(json, navigationView);
        json.Page.appendTo(navigationView);
        ui.find('.LL').set('visible', false);
    });

let activityIndicator = new ActivityIndicator({
    class: "LL",
    centerX: 0,
    bottom: 50
}).appendTo(ui.contentView);