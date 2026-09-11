import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Formik } from 'formik';

import { CheckboxField } from "ui/control/field/CheckboxField";
import { InputField } from "ui/control/field/InputField";
import { RadioField } from "ui/control/field/RadioField";
import { SelectField } from "ui/control/field/SelectField";
import { TextField } from "ui/control/field/TextField";
import { RichTextField } from "ui/control/richtexteditor/RichTextField";

jest.mock("i18n", () => ({
    tTitle: (title: string) => title
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (text: string) => text})
}));

jest.mock("ui/control", () => {
    const React = require('react');
    return {
        Checkbox: (props: React.InputHTMLAttributes<HTMLInputElement>) => React.createElement("input", props),
        FormGroup: ({children}: {children: React.ReactNode}) => children,
        TextareaAutosize: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) =>
            React.createElement("textarea", props),
        Wrapper: ({children}: {children: React.ReactNode}) => children
    };
});

jest.mock("ui/material-symbols", () => ({
    Icon: () => null,
    msVisibility: "visibility",
    msVisibilityOff: "visibility-off"
}));

jest.mock("ui/control/richtexteditor", () => {
    const React = require('react');
    return {
        RichTextEditor: ({className}: {className?: string}) => React.createElement("div", {className}),
        RichTextLinkPreviews: () => null
    };
});

jest.mock("ui/control/field/CheckboxField.css", () => ({}));
jest.mock("ui/control/field/InputField.css", () => ({}));

describe("field success feedback", () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));

    afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    function render(field: React.ReactNode, error?: string) {
        act(() => root.render(
            <Formik initialValues={{value: ""}} initialTouched={{value: true}}
                    initialErrors={error != null ? {value: error} : {}} onSubmit={() => undefined}>
                {field}
            </Formik>
        ));
    }

    test.each([
        ["input", <InputField name="value"/>],
        ["text", <TextField name="value"/>],
        ["checkbox", <CheckboxField name="value"/>],
        ["radio", <RadioField name="value"/>],
        ["select", <SelectField name="value"/>],
        ["rich text", <RichTextField name="value" format="plain-text"/>]
    ])("%s field shows success feedback only when showOk is enabled", (_name, field) => {
        render(field);
        expect(container.querySelector(".is-valid")).toBeNull();

        render(React.cloneElement(field, {showOk: true}));
        expect(container.querySelector(".is-valid")).not.toBeNull();
    });

    test("wrong indication is shown only when showWrong is enabled", () => {
        render(<InputField name="value"/>, "wrong");
        expect(container.querySelector(".is-invalid")).toBeNull();

        render(<InputField name="value" showWrong/>, "wrong");
        expect(container.querySelector(".is-invalid")).not.toBeNull();
    });

    test("error description is shown only when showError is enabled", () => {
        render(<InputField name="value"/>, "wrong");
        expect(container.querySelector(".invalid-feedback")).toBeNull();

        render(<InputField name="value" showError/>, "wrong");
        const feedback = container.querySelector(".invalid-feedback");
        expect(feedback?.textContent).toBe("wrong");
        expect(feedback?.classList.contains("d-block")).toBe(true);
    });

    test("password toggle remains visible when success feedback is hidden", () => {
        render(<InputField type="password" name="value"/>);
        expect(container.querySelector("button.show-password")).not.toBeNull();
    });
});
