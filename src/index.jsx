import {
  ActivityIndicator,
  CollectionView,
  contentView,    
  Composite,
  NavigationView,
  Page,
  ScrollView,
  Tab,
  TabFolder,
  TextView
} from 'tabris';

const ShowScreen = (response) => {
  let navigationView = new NavigationView({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }).appendTo(contentView);
  response.Page = MenuTab(response, navigationView);
  response.Page.appendTo(navigationView);
}

const MenuTab = (datanode, navigationView) => new Page({
    title: datanode.Title,
    autoDispose: false
  })
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
      itemCount: datanode.Items.length,
      createCell: () => {
        return new Composite({
        })
        .append(new TextView({
          id: "senderText",
          top: 16,
          left: 16,
          bottom: 16,
          right: 16,
          font: "bold 18px"
        }),
        new Composite({
          left: 0,
          bottom: 0,
          right: 0,
          height: 1,
          background: "#b8b8b8"
          })
        );
        },
        updateCell: (cell, index) => {
          cell.find(TextView).only().text = datanode.Items[index].Item;
          cell.data.id = index;
          cell.on("tap", () => {
                let DataPointer = datanode.Items[index];
                if (!DataPointer.hasOwnProperty("Page")) {
                    if (DataPointer.hasOwnProperty("Items")) {
                        DataPointer.Page = MenuTab(DataPointer, navigationView)
                    } else {
                        DataPointer.Page = DetailTab(DataPointer)
                    }
                }
                DataPointer.Page.appendTo(navigationView);
            })
        }
    })
    )
  );

const Item = () => new Composite()
    .append(
      new TextView({
        id: "Nummer",
        top: 3,
        left: 16
    }),
    new TextView({
      id: "descr",
      top: 3,
      right: "#price 16",
      left: "#Nummer 16"
    }),
    new TextView({
      id: "price",
      top: 3,
      right: 16
    })
    );

const GroupItem = () => new Composite({
  id: "sep",
  top: "prev()",
  left: 0,
  right: 0
  })
  .append(
    new Composite({
      top: "prev() 35",
      left: 0,
      right: 0
      })
      .append(
        new TextView({
          id: "Nummer",
          top: "#sep 3",
          left: 16,
          bottom: 5,
          font: "bold 18px"
        }),
        new TextView({
          id: "descr",
          top: "#sep 3",
          right: "#price 16",
          left: "#Nummer 16",
          font: "bold 18px"
        }),
        new TextView({
          id: "price",
          top: "#sep 3",
          right: 16,
          font: "bold 18px"
        })
      ),
      new Composite({
        left: 0,
        bottom: 0,
        right: 0,
        height: 1,
        background: "#b8b8b8"
      })
    );

const VakItem = () => new Composite({
  right: 0,
  left: 0
})
.append(
  new Composite({
    right: 8,
    left: 16,
    top: "prev() 35"
  }),
  new TextView({
    left: 0,
    top: "prev()",
    right: 0,
    id: "descr",
    font : "bold 14px",
    centerX : true
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
                        createCell: (ctype) => ctype === "#c" ? Item() : GroupItem(),
                        updateCell: (cell, index) => {                       
                            let pakket = datanode.Bundles[index];
                            cell.find("#Nummer").first(TextView).text = pakket.Campus + " - " + pakket.Nummer;
                            cell.find("#descr").first(TextView).text = pakket.Descr;
                            cell.find("#price").first(TextView).text = "€ " + pakket.Price;
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
                    createCell: (ctype) => ctype === "#c" ? CursusItem() : VakItem(),
                    updateCell: (cell, index) => {
                        let pakket = datanode.Vakken[index];
                        if (datanode.Vakken[index].Class == "#c") {
                          
                            cell.find("#Nummer").first(TextView).text = pakket.Campus + " - " + pakket.Nummer;
                            cell.find("#descr").first(TextView).text = pakket.Descr;
                            cell.find("#price").first(TextView).text = "€ " + pakket.Price;
                        } else {
                            cell.find("#descr").first(TextView).text = pakket.Name;
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
    })
    .appendTo(contentView);

    new TextView({
      class: "LL",
      centerX: 0,
      centerY: 0,
      text: 'Syncing...',
      font: "bold 18px"
    })
    .appendTo(contentView);

    localStorage.clear();

    fetch("https://cursussen.uantwerpen.be/Home/Level")
      .then(response => response.text())
      .then(response => {localStorage.setItem(key, response);return response})
      .then(response => JSON.parse(response))
      .then(response => ShowScreen(response))
      .then(() => $('.LL').set({visible: false}));

} else {
    ShowScreen(JSON.parse(data))
}
