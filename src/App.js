import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
import { I18n } from 'aws-amplify';
import dayjs from 'dayjs';
const dict = {
    'ja': {
        'Sign in to your account': 'アカウントにサインインする',
        'Create a new account': '新しいアカウントを作成する',
        'User does not exist.': "ユーザー名またはパスワードが正しくありません",
        'Incorrect username or password.': "ユーザー名またはパスワードが正しくありません",
        'Password did not conform with policy: Password not long enough': "パスワードが短すぎます",
        'Invalid session for the user, session is expired.': "セッションが無効です",
        'Password attempts exceeded': "パスワードを一定回数以上間違えたため、アカウントを無効にしました",
        'Account recovery requires verified contact information': "アカウントを復旧するには連絡先の確認が必要です",
        'Back to Sign In': "サインイン画面へ戻る",
        'Change Password': "パスワード変更",
        'Change': "変更",
        'Code': "確認コード",
        'Confirm a Code': "コードを確認する",
        'Confirm Sign In': "確認",
        'Confirm Sign Up': "サインアップ",
        'Confirm': "確認",
        'Email': "メールアドレス",
        'Forgot Password': "パスワードをお忘れの場合",
        'Loading...': "ロード中...",
        'New Password': "新しいパスワード",
        'No MFA': "MFAなし",
        'Password': "パスワード",
        'Phone Number': "電話番号",
        'Pick a File': "ファイルを選択する",
        'Resend a Code': "確認コードを再送する",
        'Resend Code': "確認コードを再送する",
        'Select MFA Type': "MFAタイプの選択",
        'Select your preferred MFA Type': "MFAタイプを選択してください",
        'Sign In Account': "サインイン",
        'Sign In': "サインイン",
        'Sign Out': "サインアウト",
        'Sign Up Account': "サインアップ",
        'Sign Up': "サインアップ",
        'Skip': "スキップする",
        'Submit': "保存",
        'Username': "ユーザー名",
        'Verify Contact': "確認",
        'Verify': "確認する"
    }
};
I18n.putVocabularies(dict);
I18n.setLanguage('ja');

const initialFormState = { name: '', description: '' };

function App() {
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchNotes();
    }, []);

    async function fetchNotes() {
        const apiData = await API.graphql({ query: listNotes });
        setNotes(apiData.data.listNotes.items);
    }

    async function createNote(e) {
        e.preventDefault();
        
        if (!formData.name || !formData.description) return;
        await API.graphql({ query: createNoteMutation, variables: { input: formData } });
        setNotes([...notes, formData]);
        setFormData(initialFormState);
    }

    async function deleteNote({ id }) {
        const newNotesArray = notes.filter(note => note.id !== id);
        setNotes(newNotesArray);
        await API.graphql({ query: deleteNoteMutation, variables: { input: { id } } });
    }
    return (
        <div className="App">
            <header className="App-header">
                <form onSubmit={createNote}>
                    <input
                        name="name"
                        onChange={e => setFormData({ ...formData, 'name': e.target.value })}
                        placeholder="Note name"
                        value={formData.name}
                    />
                    <input
                        name="description"
                        onChange={e => setFormData({ ...formData, 'description': e.target.value })}
                        placeholder="Note description"
                        value={formData.description}
                    />
                    <button type="submit">Create Note</button>
                </form>
                <div style={{ marginBottom: 30 }}>
                    {
                        notes.map(note => (
                            <div key={note.id || note.name}>
                                <h2>{note.name}</h2>
                                <p>{note.description}</p>
                                <button onClick={() => deleteNote(note)}>Delete note</button>
                            </div>
                        ))
                    }
                </div>
            </header>
            <AmplifySignOut />
        </div>
    );
}

// export default withAuthenticator(App);
export default App;