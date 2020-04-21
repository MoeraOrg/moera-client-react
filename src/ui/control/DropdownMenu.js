import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./DropdownMenu.css";

export class DropdownMenu extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.state = {visible: false};
    }

    toggle = () => {
        if (!this.state.visible) {
            this.show();
        } else {
            this.hide();
        }
    };

    show() {
        this.setState({visible: true});
        document.addEventListener("click", this.hide);
    }

    hide = () => {
        this.setState({visible: false});
        document.removeEventListener("click", this.hide);
    };

    render() {
        const items = this.props.items.filter(item => item.show);
        return (
            <Manager>
                <Reference>
                    {({ref}) => (
                        <div className="menu" ref={ref} onClick={this.toggle}>
                            <FontAwesomeIcon icon="chevron-down" className="chevron" />
                            <Popper placement="bottom-end">
                                {({ref, style, placement, scheduleUpdate}) => {
                                    if (!this.state.visible) {
                                        return null;
                                    }
                                    return (
                                        <div ref={ref} style={style}
                                             className={`bs-popover-${placement} fade dropdown-menu shadow-sm show`}>
                                            {items.length > 0 ?
                                                items.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        {item.divider && <div className="dropdown-divider"/>}
                                                        <a className="dropdown-item" href={item.href}
                                                           onClick={e => {item.onClick(); e.preventDefault()}}>
                                                            {item.title}
                                                        </a>
                                                    </React.Fragment>
                                                ))
                                            :
                                                <span className="dropdown-item disabled no-actions">No actions</span>
                                            }
                                        </div>
                                    );
                                }}
                            </Popper>
                        </div>
                    )}
                </Reference>
            </Manager>
        );
    }

}
