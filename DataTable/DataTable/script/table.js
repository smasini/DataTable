(function ($) {
    var SelectionPK = [];
    var methods = {
        Refresh: function (json) {
            if (json) {
                getJson(json, this);
            }
            var CallbackStart = this.data("callback-start");
            if (CallbackStart)
                CallbackStart();
            InitGrid(this);
        },
        MakeGrid:
            function (json) {
                getJson(json, this);

                var CallbackStart = this.data("callback-start");
                if (CallbackStart)
                    CallbackStart();
                this.data("current-page", 1);
                InitGrid(this);

                return this;
            },
    }
    var NextPage = function (element) {
        var CurrentPage = element.data("current-page");;
        CurrentPage++;
        element.data("current-page", CurrentPage);
        InitGrid(element);
    };

    var PrevPage = function (element) {
        var CurrentPage = element.data("current-page");;
        CurrentPage--;
        element.data("current-page", CurrentPage);
        InitGrid(element);
    };

    var getJson = function (json, element) {
        element.data("json", json);
        element.data("callback-start", json.CallbackStart);
        element.data("callback-end", json.CallbackEnd);
        element.data("sortable", json.Sortable);
        element.data("max-elements", json.MaxElements);
        element.data("footer", json.Footer);
        element.data("class-name", json.ClassName);
        var NumColumns = 0;
        for (var col in json.Columns) {
            if (json.Columns[col].IsVisible == true) {
                NumColumns++;
            }
        }
        for (var col in json.ActionColumns) {
            if (json.ActionColumns[col].IsVisible == true) {
                NumColumns++;
            }
        }
        if (json.Selectable)
            NumColumns++;
        element.data("num-columns", NumColumns);
        element.data("filter", json.Filter);
        element.data("order", json.Order);
    };

    var InitGrid = function (element) {
        var MaxElements = element.data("max-elements");
        var ClassName = element.data("class-name");
        var NumColumns = element.data("num-columns");
        var FilterParams = element.data("filter");
        var OrderParams = element.data("order");
        var ContainerID = element.selector.replace('#', '');
        var CurrentPage = element.data("current-page");
        ExecutePageMethod("/DataGrid/TableCreatorProxy.aspx", "MakeGrid", { ClassName: ClassName, MaxElementsForPage: MaxElements, CurrentPage: CurrentPage, Filter: FilterParams, Order: OrderParams }, true, function (jsonRet) {

            var TotalElement = jsonRet.d.Count;
            var TotalPage = jsonRet.d.NumPage;
            element.data("total-element", TotalElement);
            element.data("total-page", TotalPage);

            var objects = jsonRet.d.Entities;
            var json = element.data("json");;
            var Selectable = json.Selectable;

            var table = document.createElement('table');
            table.className = 'grid mdl-data-table mdl-shadow--2dp';
            table.style.minWidth = '100%';

            var thead = document.createElement('thead');
            //thead.className = 'mdl-color--primary-dark';

            if (Selectable) {
                thead.appendChild(createCheckBoxTHorTD('th', undefined, ContainerID));
            }
            for (var actionColumn in json.ActionColumns) {
                var column = json.ActionColumns[actionColumn];
                if (column.IsVisible == true) {
                    thead.appendChild(createTH(column.ColumnName));
                }
            }
            for (var col in json.Columns) {
                var column = json.Columns[col];
                if (column.IsVisible == true) {
                    thead.appendChild(createTH(column.ColumnDisplayName));
                }
            }
            table.appendChild(thead);

            var tbody = document.createElement('tbody');

            var pkRowName = "";
            for (var col in json.Columns) {
                if (json.Columns[col].IsPrimaryKey == true) {
                    pkRowName = json.Columns[col].ColumnName;
                    break;
                }
            }

            for (var row in objects) {
                var PKRow = objects[row][pkRowName];

                var tr = document.createElement('tr');
                tr.id = PKRow;
                tr.setAttribute('data-pk', PKRow);

                if (Selectable) {
                    tr.appendChild(createCheckBoxTHorTD('td', PKRow, ContainerID));
                }
                for (var actionColumn in json.ActionColumns) {
                    var column = json.ActionColumns[actionColumn];
                    if (column.IsVisible == true) {
                        var onclick = column.ColumnFunction + "(" + PKRow + ")";
                        var id = "" + column.ColumnID + PKRow;
                        var icon = column.ColumnIcon;
                        var tooltip = column.ColumnTooltip;
                        var color = column.ColorButton;
                        tr.appendChild(createActionButtonTD(onclick, id, icon, tooltip, color));
                    }
                }
                for (var col in json.Columns) {
                    var column = json.Columns[col];
                    var record = objects[row][column.ColumnName];
                    if (column.IsVisible == true) {
                        var value = record;
                        tr.appendChild(createTD(value, column.ColumnType));
                    }
                }
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);
            var Footer = element.data("footer");
            if (Footer == true) {
                var tfoot = document.createElement('tfoot');
                // tfoot.className = 'mdl-color--accent';
                var tr = document.createElement('tr');
                tr.id = 'tr_foot';
                tr.className = "nodrop";
                var td = document.createElement('td');
                td.className = 'mdl-data-table__cell--non-numeric';
                td.setAttribute('colspan', (NumColumns - 1));

                var buttonIndietro = document.createElement('button');
                buttonIndietro.type = 'button';
                buttonIndietro.className = 'mdl-button mdl-js-button mdl-button--icon';
                buttonIndietro.id = 'grid-pagina-indietro-btn';
                buttonIndietro.onclick = function (event) {
                    PrevPage(element);
                };

                if (CurrentPage == 1)
                    buttonIndietro.disabled = 'disabled';

                var iI = document.createElement('i');
                iI.className = 'material-icons';
                iI.innerHTML = 'keyboard_arrow_left';

                buttonIndietro.appendChild(iI);

                var spanFooter = document.createElement('span');
                spanFooter.innerHTML = CurrentPage + '/' + TotalPage;

                var buttonAvanti = document.createElement('button');
                buttonAvanti.type = 'button';
                buttonAvanti.className = 'mdl-button mdl-js-button mdl-button--icon';
                buttonAvanti.id = 'grid-pagina-avanti-btn';
                buttonAvanti.onclick = function (event) {
                    NextPage(element);
                };
                if (CurrentPage == TotalPage)
                    buttonAvanti.disabled = 'disabled';

                var iA = document.createElement('i');
                iA.className = 'material-icons';
                iA.innerHTML = 'keyboard_arrow_right';

                buttonAvanti.appendChild(iA);

                var spanToolI = document.createElement('span');
                spanToolI.className = 'mdl-tooltip';
                spanToolI.setAttribute('for', 'grid-pagina-indietro-btn');
                spanToolI.innerHTML = 'Pagina Precedente';

                var spanToolA = document.createElement('span');
                spanToolA.className = 'mdl-tooltip';
                spanToolA.setAttribute('for', 'grid-pagina-avanti-btn');
                spanToolA.innerHTML = 'Pagina Successiva';

                td.appendChild(buttonIndietro);
                td.appendChild(spanToolI);
                td.appendChild(spanFooter);
                td.appendChild(buttonAvanti);
                td.appendChild(spanToolA);

                tr.appendChild(td);

                var td2 = document.createElement('td');
                var spanElementiTotali = document.createElement('span');
                spanElementiTotali.className = 'mdl-badge';
                spanElementiTotali.innerHTML = 'Elementi totali trovati';
                spanElementiTotali.setAttribute('data-badge', TotalElement);

                td2.appendChild(spanElementiTotali);
                tr.appendChild(td2);

                tfoot.appendChild(tr);
                table.appendChild(tfoot);
            }
            componentHandler.upgradeElement(table);
            // componentHandler.upgradeAllRegistered();
            document.getElementById(ContainerID).innerHTML = '';
            table.id = ContainerID + "_table";
            document.getElementById(ContainerID).appendChild(table);
            var Sortable = element.data("sortable");
            if (Sortable) {
                $('#' + ContainerID + "_table").tableDnD({
                    onDragClass: "mdl-color--grey-400",
                    onDrop: function (table, row) {
                        var pk = row.getAttribute('data-pk');
                        var rows = table.tBodies[0].rows;
                        var pkPrimaRigaSuccessiva = -1;
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i]) {
                                if (rows[i].id == row.id) {
                                    if (i + 1 < rows.length) {
                                        pkPrimaRigaSuccessiva = rows[i + 1].getAttribute('data-pk');
                                    }
                                    break;
                                }
                            }
                        }
                        ExecutePageMethod("/DataGrid/TableCreatorProxy.aspx", "ChangeOrder", { PKToMove: pk, PKToAfter: pkPrimaRigaSuccessiva, ClassName: ClassName }, true, function () { }, function () { });
                    }
                });
            }
            var CallbackEnd = element.data("callback-end");
            if (CallbackEnd)
                CallbackEnd();
        }, function () {
            console.log("errore");
        });
    };

    function createTH(columnName) {
        var th = document.createElement('th');
        th.className = 'mdl-data-table__cell--non-numeric';
        th.innerHTML = columnName;
        return th;
    }

    function createTD(value, type) {
        var td = document.createElement('td');
        td.className = 'mdl-data-table__cell--non-numeric';
        td.style.wordWrap = 'break-word';
        td.style.whiteSpace = '-o-pre-wrap';
        td.style.whiteSpace = 'pre-wrap';
        td.style.whiteSpace = '-moz-pre-wrap';
        td.style.whiteSpace = '-pre-wrap';

        if (type == 'float') {
            var textNode = document.createTextNode(parseFloat(value).toFixed(2));
            td.appendChild(textNode);
        } else if (type == 'bool') {
            var label = document.createElement('label');
            label.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect';
            var input = document.createElement('input');
            input.className = 'mdl-checkbox__input';
            input.setAttribute('type', 'checkbox');
            input.setAttribute('disabled', 'disabled');
            if (value == 1)
                input.setAttribute('checked', 'checked');
            label.appendChild(input);
            componentHandler.upgradeElement(label);
            td.appendChild(label);
        } else if (type == "euro") {
            var textNode = document.createTextNode(parseFloat(value).toFixed(2) + " €");
            td.appendChild(textNode);
        } else {
            var textNode = document.createTextNode(value);
            td.appendChild(textNode);
        }

        return td;
    }

    function createActionButtonTD(onclick, id, icon, tooltip, color) {
        var td = document.createElement('td');
        td.className = 'mdl-data-table__cell--non-numeric';

        var button = document.createElement('button');
        button.className = 'mdl-button mdl-js-button mdl-button--icon mdl-button--colored';
        button.setAttribute('type', 'button');
        button.setAttribute('onclick', onclick);
        button.id = id;
        if (color)
            button.style.color = color;

        var i = document.createElement('i');
        i.className = 'material-icons';
        i.innerHTML = icon;

        button.appendChild(i);
        td.appendChild(button);

        if (tooltip) {
            var span = document.createElement('span');
            span.className = 'mdl-tooltip';
            span.setAttribute('for', id);
            span.innerHTML = tooltip;
            //        componentHandler.upgradeElement(span);
            td.appendChild(span);
        }

        return td;
    }

    function createCheckBoxTHorTD(element, pk, ContainerID) {
        var th = document.createElement(element);
        th.className = 'mdl-data-table__cell--non-numeric';

        var label = document.createElement('label');
        label.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select selection-grid-general';
        var input = document.createElement('input');
        input.className = 'mdl-checkbox__input';
        input.setAttribute('type', 'checkbox');

        if (pk) {
            label.setAttribute('data-pk', pk);
            input.setAttribute('data-pk', pk);
            input.addEventListener('blur', changeSingleHandler);
        } else {
            label.addEventListener('change', changeAllHandler);
        }

        label.appendChild(input);
        componentHandler.upgradeElement(label);
        th.appendChild(label);

        return th;
    }

    function changeSingleHandler(e, ContainerID) {
        var pk = e.target.getAttribute('data-pk');
        var index = findIndexOf(pk);
        if (e.target.checked) {
            //aggiungo pk
            if (index == -1)
                SelectionPK.push(pk);
        } else {
            //rimuovo pk
            if (pk != -1)
                SelectionPK.splice(index, 1);
        }

        //se sono tutti checkati checko il primo se almeno uno non lo è lo scecko
        var first;
        var done = false;
        var checkboxes = document.getElementById(ContainerID).querySelector('table').querySelectorAll('.selection-grid-general');
        for (var i = 0; i < checkboxes.length; i++) {
            var pk = checkboxes[i].getAttribute('data-pk');
            if (pk) {
                if (hasClass(checkboxes[i], 'is-checked') == false) {
                    var done = true;
                    break;
                }
            } else {
                first = checkboxes[i];
                if (e.target.checked == false) {
                    first.MaterialCheckbox.uncheck();
                    done = true;
                    break;
                }
            }
        }
        if (!done) {
            first.MaterialCheckbox.check();
        }
    }

    function hasClass(el, classe) {
        for (var c in el.classList) {
            if (el.classList[c] == classe) {
                return true;
            }
        }
        return false;
    }

    function findIndexOf(pk) {
        for (var i = 0; i < SelectionPK.length; i++) {
            if (SelectionPK[i] == pk)
                return i;
        }
        return -1;
    }

    function changeAllHandler(e, ContainerID) {
        var check = e.target.checked;
        var checkboxes = document.getElementById(ContainerID).querySelector('table').querySelectorAll('.selection-grid-general');
        for (var i = 0; i < checkboxes.length; i++) {
            var pk = checkboxes[i].getAttribute('data-pk');
            var index = findIndexOf(pk);
            if (pk) {
                if (check) {
                    checkboxes[i].MaterialCheckbox.check();
                    if (index == -1)
                        SelectionPK.push(pk);
                } else {
                    checkboxes[i].MaterialCheckbox.uncheck();
                    if (index != -1)
                        SelectionPK.splice(index, 1);
                }
            }
        }
    }

    $.fn.dataTable = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist!');
        }
    };
})(jQuery);