﻿(function ($) {
    var id = 0;
    var menus = {};

    $.fn.materialMenu = function (action, settings, other) {
        var settings = $.extend({
            animationSpeed: 250,
            position: "",
            items: [],
            top: false,
            left: false,
            noclip: false,
            close: false,
            delete: false
        }, settings);

        return this.each(function (item) {
            var parent = $(this);
            if (action === "init") {
                parent.attr('id', getNextId());
                var menu = getMenuForParent(parent);
                menu.element = $('<div class="material-menu"><ul></ul></div>');
                menu.parent = parent;
                menu.settings = settings;
                menu.pos = {
                    y: settings.top,
                    x: settings.left
                };
                menu.items = [];

                settings.items.forEach(function (item) {
                    var item = $.extend({
                        text: "",
                        type: "normal",
                        icon: "",
                        radioGroup: "default",
                        visible: true,
                        click: function () { }
                    }, item);
                    if (item.type === 'toggle') {
                        var elStr = "<li class='check" + (item.checked ? "" : " unchecked") + "'></li>";
                        var itemElement = $(elStr)
                            .append("<i class='material-icons md-24'>check</i>")
                            .append("<span>" + item.text + "</span>")
                            .css({ "display": (item.visible ? "inherit" : "none") })
                            .click(function () {
                                if (item.checked) {
                                    item.element.addClass('unchecked');
                                } else {
                                    item.element.removeClass('unchecked');
                                }
                                item.checked = !item.checked;
                                item.click(menu.parent, item.checked);
                                if (!settings.close) {
                                    closeMenu(menu, settings);
                                }
                            });
                    } else if (item.type === 'radio') {
                        var elStr = "<li class='check" + (item.checked ? "" : " unchecked") + "'></li>";
                        var itemElement = $(elStr)
                            .append("<i class='material-icons md-24'>check</i>")
                            .append("<span>" + item.text + "</span>")
                            .css({ "display": (item.visible ? "inherit" : "none") })
                            .click(function () {
                                menu.items.forEach(function (otherItem) {
                                    if (otherItem.radioGroup === item.radioGroup) {
                                        if (otherItem == item) {
                                            item.element.removeClass('unchecked');
                                            otherItem.checked = false;
                                        } else {
                                            otherItem.element.addClass('unchecked');
                                            otherItem.checked = false;
                                        }
                                    }
                                });
                                item.click(menu.parent, item.checked);
                                if (!settings.close) {
                                    closeMenu(menu, settings);
                                }
                            });
                    } else if (item.type === 'divider') {
                        var itemElement = $("<li class='divider'></li>")
                        .css({ "display": (item.visible ? "inherit" : "none") })
                    } else if (item.type === 'label') {
                        var itemElement = $("<li class='label'></li>")
                        .css({ "display": (item.visible ? "inherit" : "none") })
                            .html(item.text);
                    } else if (item.type === 'submenu') {
                        var itemElement = $("<li></li>")
                            .append("<span>" + item.text + "</span>")
                            .css({ "display": (item.visible ? "inherit" : "none") })
                            .append('<div class="icon-wrapper sm-right"><i class="material-icons md-24 sm-rotate-90">arrow_drop_up</i></div>')
                            .click(function () {
                                item.click(menu.parent);
                                if (!settings.close) {
                                    closeMenu(menu, settings);
                                }
                            });
                    } else if (item.type === 'normal') {
                        var icon = (item.icon.length > 0) ? `<icon class='material-icons'>${item.icon}</icon>` : ``;
                        var itemElement = $("<li></li>")
                            .css({ "display": (item.visible ? "inherit" : "none") })
                            .html(item.text + icon)
                            .click(function () {
                                item.click(menu.parent);
                                if (!settings.close) {
                                    closeMenu(menu, settings);
                                }
                            });
                    } else {
                        console.log("Menu item with invalid type, type was: " + item.type);
                        return;
                    }
                    itemElement.attr('id', getNextId());
                    item.element = itemElement;
                    menu.element.children('ul').append(itemElement);
                    menu.items.push(item);
                });
                menu.element.hide();
                $('body').append(menu.element);

                return this;
            }

            if (action === 'open') {
                var menu = getMenuForParent(parent);
                if (menu.open) {
                    return;
                }

                openMenu(menu, settings, other);
                return this;
            }

            if (action === 'close') {
                var menu = getMenuForParent(parent);
                if (!menu.open) {
                    return;
                }
                closeMenu(menu, settings);
                return this;
            }
        });
    };

    function openMenu(menu, o, settings) {
        menu.open = true;
        updatePos(menu, (o.pageX || false), (o.pageY || false), settings);

        menu.element.css('opacity', 0)
            .slideDown(menu.settings.animationSpeed)
            .animate(
                { opacity: 1 },
                { queue: false, duration: 'slow' }
            );

        $(document).on('mousedown', function (event) {
            if (!$(event.target).closest(menu.element).length) {
                closeMenu(menu, settings)
            }
        });

        $("webview").on('focus', (e) => {
            closeMenu(menu, settings)
        });

        $(window).on("resize", (e) => {
            closeMenu(menu, settings)
        });
    }

    function closeMenu(menu, settings) {
        menu.element.fadeOut(menu.settings.animationSpeed / 2, function () {
            menu.open = false;

            if (settings === undefined) {
                settings = {};
                settings.delete = false;
            }
            if (settings.delete) {
                menu.element.remove();
            }
        });
    }

    function updatePos(menu, x, y, settings) {
        // position the div, according to it's parent using the worlds most hacky thing ever
        var offset = $("#" + menu.parent.attr('id')).offset();
        var left = (menu.pos.x) ? menu.pos.x : offset.left;
        var top = (menu.pos.y) ? menu.pos.y + menu.parent.outerHeight() : offset.top + menu.parent.outerHeight();

        left = x || left;
        top = y || top;

        // If the menu is greater than 75% of the screen size, it should scroll
        menu.element.height('auto'); // so the height calculation works correctly
        var menuHeight = menu.element.outerHeight();
        var windowHeight = $(window).height();
        if (menuHeight > windowHeight * 0.75) {
            menu.element.height(windowHeight * 0.75);
            menuHeight = menu.element.outerHeight();
        }

        // Offset top, if the menu would appear below the screen (with 5px margin)
        var distanceFromBottom = windowHeight - menuHeight - top - 5;
        if (distanceFromBottom < 0) {
            if (!settings || !settings.noclip) {
                // Need to adjust the menu, to make it fit the screen bounds
                if (distanceFromBottom > -menuHeight / 2) {
                    menu.element.height(menu.element.height() + distanceFromBottom);

                    // If doing overlay positioning, subtract height
                    if (menu.settings.position.indexOf('overlay') >= 0) {
                        top -= menu.parent.outerHeight();
                    }
                } else {
                    top -= menuHeight;
                    // If NOT doing overlay positioning, subtract height
                    if (menu.settings.position.indexOf('overlay') == -1) {
                        top -= menu.parent.outerHeight();
                    }
                }
            } else {
                top += distanceFromBottom;
            }
        }

        // Calculate width so we can ensure the menu is not displayed off of the right hand side of the screen
        var menuWidth = menu.element.outerWidth()
        var windowWidth = $(window).width();
        var distanceFromRight = windowWidth - menuWidth - left - 5;
        if (distanceFromRight < 0) {
            if (!settings || !settings.noclip) {
                left -= menu.element.outerWidth() - menu.parent.outerWidth();
            } else {
                left += distanceFromRight;
            }
        }

        menu.element.css({ top: top, left: left });
    }

    function getMenuForParent(parent) {
        var id = parent.attr('id');
        if (menus[id] == undefined) {
            menus[id] = {};
        }
        return menus[id];
    }

    function getNextId() {
        return 'sm-' + id++;
    }

    // Should rethink how this works, but will do for now
    $(document).ready(function () {
        var items = $('sm-title');
        for (var i = 0; i < items.length; i++) {
            var element = items.eq(i);
            var newElement = $('<span></span>')
                .text(element.text())
                .addClass('sm-text sm-font-title')
                .attr('id', getNextId());
            element.replaceWith(newElement);
        }

        items = $('sm-toolbar');
        for (var i = 0; i < items.length; i++) {
            var element = items.eq(i);
            var newElement = $('<div></div>')
                .html(element.html())
                .addClass('sm-toolbar sm-primary-500')
                .attr('id', getNextId());

            var toolbarItems = newElement.find('sm-item');
            console.log(toolbarItems);
            for (var j = 0; j < toolbarItems.length; j++) {
                var item = toolbarItems.eq(j);
                var newItem = $('<span></span>')
                    .append($('<i></i>')
                        .text(item.text())
                        .addClass('sm-icon material-icons md-24'))
                    .attr('id', getNextId());
                if (item.attr('left') != undefined) {
                    newItem.addClass('sm-left');
                } else if (item.attr('right') != undefined) {
                    newItem.addClass('sm-right');
                }
                item.replaceWith(newItem);
            }

            element.replaceWith(newElement);
        }
    });
}(jQuery));