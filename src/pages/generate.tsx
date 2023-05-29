import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";
import { useBuyCredits } from "~/hooks/useBuyCredits";
import { api } from "~/utils/api";



const GeneratePage: NextPage = () => {
    
    const utils = api.useContext()
    const {buyCredits} = useBuyCredits();

    const session = useSession();
    const isLoggedIn = !!session.data;

    const [form, setForm] = useState({
        prompt: "",
    });

    const [aiMessage, setAiMessage] = useState('')

    const generateResponse = api.generate.generateResponse.useMutation({
        onSuccess(data){
            console.log("mutation finished:", data.aiMessage)
            if (!data.aiMessage) return;
            setAiMessage(data.aiMessage)
            void utils.user.getCredits.invalidate()
        }
    });

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        //SUBMIT FORM DATA TO BACKEND.
        generateResponse.mutate({
            prompt: form.prompt,
        });
        setForm((prev) => ({
            ...prev,
            prompt: "",
        }))
    }

    function updateForm(key: string) {
        return function(e: React.ChangeEvent<HTMLInputElement>) {
            setForm((prev) => ({
                ...prev,
                [key]: e.target.value,
            }))
        }
    }    

    return (
        <>
            <Head>
                <title>GPTtherapy</title>
                <meta name="description" content="Therapy on the go" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="main">
                <div className="gradient"/>
            </div>
            <main className="flex min-h-screen flex-col items-center justify-center">
                {isLoggedIn && (
                    <>
                    {/* HOOK ON FRONT END HITS BACKEND TRPC MUTATION, RETURNS CHECKOUT SESSION ID TO REDIRECT TO STRIPE WHEN USER CLICKS ON THIS BUTTON */}
                    <button className="outline_btn items-center justify-center"
                        onClick={() => { 
                            buyCredits().catch(console.error) }}>Buy Credits
                    </button>
                    
                    </>
                
                )}
                
                <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                    <FormGroup>
                        <label className="items-start"> Prompt: </label>
                        <Input type="text"
                            value={form.prompt}
                            onChange={updateForm("prompt")}>
                        </Input>
                    </FormGroup>
                    
                    <button className="black_btn">Submit</button>
                </form>
                <div> {aiMessage} </div>
            </main>
        </>
    );
};

export default GeneratePage;
