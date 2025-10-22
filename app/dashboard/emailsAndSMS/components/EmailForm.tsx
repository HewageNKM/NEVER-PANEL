import React, {useRef, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Box, Button, FormControl, Stack, TextField, Typography} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {$getRoot, $getSelection} from "lexical";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {LexicalErrorBoundary} from "@lexical/react/LexicalErrorBoundary";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {useSnackbar} from "@/contexts/SnackBarContext";
import {$generateHtmlFromNodes} from "@lexical/html";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import ToolbarPlugin from "./Toolbarplugin";
import {sendEmailAction} from "@/actions/emailAndSMSActions";
import {Email} from "@/model";

const EmailForm = ({open, onClose}: { open: boolean; onClose: () => void }) => {
    const {showNotification} = useSnackbar();
    const editorRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (editorState) => {
        editorState.read(() => {
            const root = $getRoot();
            const selection = $getSelection();
        });
    };
    const onEmailFormSubmit = async (evt) => {
        try {
            evt.preventDefault();
            setIsLoading(true);

            if (!editorRef.current) {
                throw new Error("Editor not initialized");
            }

            const editorState = editorRef.current.getEditorState();
            let htmlContent = "";

            editorState.read(() => {
                htmlContent = $generateHtmlFromNodes(editorRef.current, null);
            });

            const to = evt.target.to.value.toString().trim();
            const subject = evt.target.subject.value.toString().trim();

            const newEmail: Email = {
                to: to,
                message: {
                    subject: subject,
                    html: htmlContent
                }
            };

            await sendEmailAction(newEmail);

            // Reset the editor content
            editorRef.current.update(() => {
                const emptyState = editorRef.current.parseEditorState('{}'); // Empty state
                editorRef.current.setEditorState(emptyState);
            });

            evt.target.reset();
            showNotification("Email sent successfully", "success");
            onClose();
        } catch (e) {
            console.error(e);
            showNotification(e.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>
                <Typography variant="h5">Compose Email</Typography>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={onEmailFormSubmit}>
                    <Stack padding={2} spacing={3}>
                        <FormControl>
                            <TextField disabled={isLoading}
                                       name={"to"}
                                       label={"To"}
                                       required id="to-email"
                                       aria-describedby="to-email-helper-text"/>
                        </FormControl>
                        <FormControl>
                            <TextField disabled={isLoading}
                                       name={"subject"}
                                       id="email-subject"
                                       required
                                       label="Subject"
                                       aria-describedby="email-subject-helper-text"/>
                        </FormControl>

                        {/* Rich Text Editor with Toolbar */}
                        <Box
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "10px",
                                minHeight: "250px",
                            }}
                        >
                            <LexicalComposer
                                initialConfig={{
                                    namespace: "email-form",

                                    theme: {
                                        paragraph: "editor-paragraph",
                                    },
                                    onError: (error) => {
                                        showNotification(error.message, "error");
                                    },
                                }}
                            >
                                <EditorInstanceSetter editorRef={editorRef}/>
                                <ToolbarPlugin/>
                                <RichTextPlugin
                                    contentEditable={
                                        <ContentEditable
                                            disabled={isLoading}
                                            className="editor-content"
                                            style={{
                                                border: "2px solid #ccc",
                                                borderRadius: "5px",
                                                minHeight: "250px",
                                                padding: "10px",
                                                outline: "none",
                                                overflowY: "auto",
                                            }}
                                        />
                                    }
                                    ErrorBoundary={LexicalErrorBoundary}
                                />
                                <OnChangePlugin onChange={onChange}/>
                                <HistoryPlugin/>
                            </LexicalComposer>
                        </Box>
                    </Stack>

                    <DialogActions>
                        <Button
                            disabled={isLoading}
                            onClick={onClose}>
                            Cancel</Button>
                        <Button
                            disabled={isLoading}
                            type="submit"
                            variant={"contained"}>
                            Send
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// Helper component to store editor instance
const EditorInstanceSetter = ({editorRef}) => {
    const [editor] = useLexicalComposerContext();
    editorRef.current = editor;
    return null;
};

export default EmailForm;
