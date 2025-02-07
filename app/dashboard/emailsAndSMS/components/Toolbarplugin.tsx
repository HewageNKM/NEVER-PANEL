import React, {useCallback} from "react";
import {FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND,COMM} from "lexical";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {
    FormatAlignCenter,
    FormatAlignLeft,
    FormatAlignRight,
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    StrikethroughS
} from "@mui/icons-material";

const ToolbarPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const [formats, setFormats] = React.useState<string[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleFormat = useCallback(
        (event, newFormats) => {
            setFormats(newFormats);

            newFormats.forEach((format) => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
            });
        },
        [editor]
    );

    const handleTextAlign = (align) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
    };

    const handleColorSelect = (color) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, color);
        setAnchorEl(null);
    };

    return (
        <Stack sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            gap: 1,
            my: 1,
            flexWrap: "wrap"
        }}>
            {/* Text Formatting */}
            <ToggleButtonGroup value={formats} onChange={handleFormat} aria-label="text formatting">
                <ToggleButton value="bold" aria-label="bold">
                    <FormatBold/>
                </ToggleButton>
                <ToggleButton value="italic" aria-label="italic">
                    <FormatItalic/>
                </ToggleButton>
                <ToggleButton value="underline" aria-label="underline">
                    <FormatUnderlined/>
                </ToggleButton>
                <ToggleButton value="strikethrough" aria-label="strikethrough">
                    <StrikethroughS/>
                </ToggleButton>
            </ToggleButtonGroup>

            {/* Alignment */}
            <ToggleButtonGroup onChange={(event, align) => handleTextAlign(align)} aria-label="text alignment">
                <ToggleButton value="left" aria-label="align left">
                    <FormatAlignLeft/>
                </ToggleButton>
                <ToggleButton value="center" aria-label="align center">
                    <FormatAlignCenter/>
                </ToggleButton>
                <ToggleButton value="right" aria-label="align right">
                    <FormatAlignRight/>
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    );
};

export default ToolbarPlugin;
