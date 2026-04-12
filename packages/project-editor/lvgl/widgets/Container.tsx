import React from "react";
import { makeObservable } from "mobx";

import {
    IMessage,
    MessageType,
    makeDerivedClassInfo,
    LVGLParts,
    PropertyType
} from "project-editor/core/object";

import { ProjectType } from "project-editor/project/project";

import { LVGLTabviewWidget, LVGLTabWidget, LVGLWidget } from "./internal";
import { getDropdown, getTabview } from "../widget-common";
import { getProjectStore, Message } from "project-editor/store";
import { getLvglParts } from "../lvgl-versions";
import { Rect } from "eez-studio-shared/geometry";
import { AutoSize } from "project-editor/flow/component";
import { IResizeHandler } from "project-editor/flow/flow-interfaces";
import type { LVGLCode } from "project-editor/lvgl/to-lvgl-code";

////////////////////////////////////////////////////////////////////////////////

export class LVGLContainerWidget extends LVGLWidget {
    static classInfo = makeDerivedClassInfo(LVGLWidget.classInfo, {
        enabledInComponentPalette: (projectType: ProjectType) =>
            projectType === ProjectType.LVGL,

        label: (widget: LVGLTabWidget) => {
            const tabview = getTabview(widget);
            if (tabview) {
                if (tabview.children.indexOf(widget) == 0) {
                    return "Bar";
                } else if (tabview.children.indexOf(widget) == 1) {
                    return "Content";
                }
            }

            const dropdown = getDropdown(widget);
            if (dropdown && dropdown.children.indexOf(widget) == 0) {
                return "List";
            }

            return LVGLWidget.classInfo.label!(widget);
        },

        componentPaletteGroupName: "!1Basic",

        properties: [
            {
                name: "containerVersion",
                type: PropertyType.Number,
                hideInPropertyGrid: true,
                hideInDocumentation: "all"
            }
        ],

        defaultValue: {
            left: 0,
            top: 0,
            width: 300,
            height: 200,
            clickableFlag: true,
            localStyles: {
                definition: {
                    MAIN: {
                        DEFAULT: {
                            pad_left: 0,
                            pad_top: 0,
                            pad_right: 0,
                            pad_bottom: 0,
                            bg_opa: 0,
                            border_width: 0,
                            radius: 0
                        }
                    }
                }
            },
            containerVersion: 1
        },

        beforeLoadHook: (object, jsObject) => {
            if (jsObject.containerVersion == undefined) {
                const definition = LVGLContainerWidget.classInfo.defaultValue.localStyles.definition;

                Object.keys(definition).forEach(part => {
                    Object.keys(definition[part]).forEach(state => {
                        Object.keys(definition[part][state]).forEach(propertyName => {
                            if (jsObject.localStyles?.definition?.[part]?.[state]?.[propertyName] == undefined) {
                                if (!jsObject.localStyles) {
                                    jsObject.localStyles = {};
                                }
                                if (!jsObject.localStyles.definition) {
                                    jsObject.localStyles.definition = {};
                                }
                                if (!jsObject.localStyles.definition[part]) {
                                    jsObject.localStyles.definition[part] = {};
                                }
                                if (!jsObject.localStyles.definition[part][state]) {
                                    jsObject.localStyles.definition[part][state] = {};
                                }
                                jsObject.localStyles.definition[part][state][propertyName] = definition[part][state][propertyName];
                            }
                        });
                    });
                });

                jsObject.containerVersion = 1;
            }
        },

        check: (widget: LVGLTabviewWidget, messages: IMessage[]) => {
            const tabview = getTabview(widget);
            if (tabview) {
                if (tabview.children.indexOf(widget) == 1) {
                    for (let i = 0; i < widget.children.length; i++) {
                        const childWidget = widget.children[i];
                        if (!(childWidget instanceof LVGLTabWidget)) {
                            messages.push(
                                new Message(
                                    MessageType.ERROR,
                                    `Tab should be child of Content container`,
                                    childWidget
                                )
                            );
                        }
                    }
                }
            }
        },

        icon: (
            <svg
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
            >
                <path d="M0 0h24v24H0z" stroke="none" />
                <rect x="3" y="5" width="18" height="14" rx="2" />
            </svg>
        ),

        lvgl: {
            parts: (widget: LVGLWidget) =>
                Object.keys(getLvglParts(widget)) as LVGLParts[],
            defaultFlags:
                "CLICKABLE|CLICK_FOCUSABLE|GESTURE_BUBBLE|PRESS_LOCK|SCROLLABLE|SCROLL_CHAIN_HOR|SCROLL_CHAIN_VER|SCROLL_ELASTIC|SCROLL_MOMENTUM|SCROLL_WITH_ARROW|SNAPPABLE",

            oldInitFlags:
                "PRESS_LOCK|CLICK_FOCUSABLE|GESTURE_BUBBLE|SNAPPABLE|SCROLL_ELASTIC|SCROLL_MOMENTUM|SCROLL_CHAIN",
            oldDefaultFlags:
                "CLICKABLE|PRESS_LOCK|CLICK_FOCUSABLE|GESTURE_BUBBLE|SNAPPABLE|SCROLLABLE|SCROLL_ELASTIC|SCROLL_MOMENTUM|SCROLL_CHAIN"
        },

        setRect: (widget: LVGLContainerWidget, value: Partial<Rect>) => {
            const tabview = getTabview(widget);
            if (tabview) {
                if (tabview.children.indexOf(widget) == 0) {
                    if (
                        (tabview.tabviewPosition == "TOP" ||
                            tabview.tabviewPosition == "BOTTOM") &&
                        value.height != undefined
                    ) {
                        const projectStore = getProjectStore(widget);
                        projectStore.updateObject(tabview, {
                            tabviewSize: value.height
                        });
                    } else if (
                        (tabview.tabviewPosition == "LEFT" ||
                            tabview.tabviewPosition == "RIGHT") &&
                        value.width != undefined
                    ) {
                        const projectStore = getProjectStore(widget);
                        projectStore.updateObject(tabview, {
                            tabviewSize: value.width
                        });
                    }
                }
            } else {
                LVGLWidget.classInfo.setRect!(widget, value);
            }
        }
    });

    override makeEditable() {
        super.makeEditable();

        makeObservable(this, {});
    }

    override get autoSize(): AutoSize {
        const tabview = getTabview(this);
        if (tabview) {
            if (
                tabview.children.indexOf(this) == 0 ||
                tabview.children.indexOf(this) == 1
            ) {
                return "both";
            }
        }

        const dropdown = getDropdown(this);
        if (dropdown && dropdown.children.indexOf(this) == 0) {
            return "both";
        }

        return super.autoSize;
    }

    override getResizeHandlers(): IResizeHandler[] | undefined | false {
        const tabview = getTabview(this);
        if (tabview && tabview.children.indexOf(this) == 0) {
            if (
                tabview.tabviewPosition == "TOP" ||
                tabview.tabviewPosition == "BOTTOM"
            ) {
                return [
                    {
                        x: 50,
                        y: 0,
                        type: "n-resize"
                    },
                    {
                        x: 50,
                        y: 100,
                        type: "s-resize"
                    }
                ];
            } else if (
                tabview.tabviewPosition == "LEFT" ||
                tabview.tabviewPosition == "RIGHT"
            ) {
                return [
                    {
                        x: 0,
                        y: 50,
                        type: "w-resize"
                    },
                    {
                        x: 100,
                        y: 50,
                        type: "e-resize"
                    }
                ];
            }
        }

        const dropdown = getDropdown(this);
        if (dropdown && dropdown.children.indexOf(this) == 0) {
            return [];
        }

        return super.getResizeHandlers();
    }

    override toLVGLCode(code: LVGLCode) {
        const tabview = getTabview(this);
        if (tabview) {
            if (tabview.children.indexOf(this) == 0) {
                code.getObject(
                    code.isV9
                        ? "lv_tabview_get_tab_bar"
                        : "lv_tabview_get_tab_btns"
                );
                return;
            }

            if (tabview.children.indexOf(this) == 1) {
                code.getObject(`lv_tabview_get_content`);
                return;
            }
        } else {
            const dropdown = getDropdown(this);
            if (dropdown && dropdown.children.indexOf(this) == 0) {
                code.getObject("lv_dropdown_get_list");
                return;
            }
        }

        code.createObject(`lv_obj_create`);
    }
}
