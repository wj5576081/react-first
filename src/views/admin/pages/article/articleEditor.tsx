import React, {FC, ReactElement, useEffect, useLayoutEffect, useState} from "react";
import SimpleMDE from 'simplemde'
import {translateMarkdown} from "../../../../lib/utils";

interface AdminArticleEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const AdminArticleEditor: FC<AdminArticleEditorProps> = ({value, onChange}: AdminArticleEditorProps): ReactElement => {

    const [simpleMde, setSimpleMde] = useState<SimpleMDE>(null);

    useEffect(() => {
        if (simpleMde) {
            simpleMde.value(value);
            simpleMde.codemirror.extendSelection(simpleMde.codemirror.constructor.Pos(simpleMde.codemirror.lastLine()))
        }
    }, [value]);

    useLayoutEffect(() => {
        const simpleMDE = new SimpleMDE({
            element: document.getElementById('editor'),
            autofocus: true,
            previewRender: translateMarkdown,
            placeholder: '请输入文章内容'
        });
        simpleMDE.codemirror.on("blur", () => {
            onChange(simpleMDE.value());
        });
        setSimpleMde(simpleMDE);
    }, []);

    return (
        <textarea id="editor" defaultValue={value} />
    )
};

export default AdminArticleEditor;
