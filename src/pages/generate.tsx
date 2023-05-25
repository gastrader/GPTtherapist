import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";
import { api } from "~/utils/api";


const GeneratePage: NextPage = () => {
    
    const [form, setForm] = useState({
        prompt: "",
    });

    const generateResponse = api.generate.generateResponse.useMutation();

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        //SUBMIT FORM DATA TO BACKEND.
        generateResponse.mutate({
            prompt: form.prompt,
        });

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
                <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                    <FormGroup>
                        <label> Prompt: </label>
                        <Input type="text"
                            value={form.prompt}
                            onChange={updateForm("prompt")}>
                        </Input>
                    </FormGroup>
                    <button className="black_btn">Submit</button>
                </form>
            </main>
        </>
    );
};

export default GeneratePage;
