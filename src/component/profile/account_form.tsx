/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "../../lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";

import { jsPDF } from "jspdf";

const accountFormSchema = z.object({
  type: z.string({
    required_error: "Please select a type to retrieve.",
  }),
  date: z.date({
    required_error: "Please select a date to retrieve the transcript.",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
const [submittedValues, setSubmittedValues] = useState<AccountFormValues | undefined>();
const [clickedId, setClickedId] = useState("");
const form = useForm<AccountFormValues>({
  resolver: zodResolver(accountFormSchema),
});

const {
  data: convos,
  isLoading,
  error,
} = api.chatqueryRouter.queryChat.useQuery(submittedValues || {type: "text", date: new Date()}, {
  enabled: Boolean(submittedValues),
});

const onSubmit = (data: AccountFormValues) => {
  console.log("we are in submit function", data);
  setSubmittedValues(data);
  console.log(convos)
};

const { data } = api.chatqueryRouter.convoFile.useQuery({ id: clickedId });
console.log("The data variable is:",data)

const downloadData = (data: string) => {
  if (data) {
    //ATEMPT AT PDF
    // const doc = new jsPDF('p');
    // doc.setFont('Arial').setFontSize(12).splitTextToSize(data, 7.25)
    // doc.text(data, 10, 10);
    // doc.save("PDFWORKED72.pdf");
    const blob = new Blob([data], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href,
      style: "display:none",
      download: "Conversation.txt",
    });
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(href);
    a.remove();
  }
}
 useEffect(() => {
   if (clickedId) { 
    // Fetch or compute your data here
    console.log("WE ARE IN THE USE EFFECT, SHOULD BE DONWLOADING")
    ;
   }
 }, [clickedId]);


if (error) {
  return <p>An error occurred: {error.message}</p>; // Or your own error component
}

const handleClick =  (id:string) => {
  setClickedId(id)
    if (data) {
      downloadData(data);
    } else {
      console.error("Data is undefined");
    }
};
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of transcript to retrieve" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TEXT">Chat Logs</SelectItem>
                    <SelectItem value="VIDEO">Video Transcript</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Do you want to retrieve a video transcript or chat transcript?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The date of the transcript to retrieve.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Get Transcript</Button>
        </form>
      </Form>
      {convos && (
        <div className="container mx-auto mb-10 mt-20 w-[800px] items-center justify-center rounded">
          <h1 className="border py-3 text-center text-4xl font-bold text-black">
            Transcripts
          </h1>
          <div className=" h-[400px] flex-grow overflow-y-auto border p-6">
            {convos &&
              convos.map((convo, i) => (
                <div
                  key={i}
                  className="my-2 flex rounded-xl border bg-gray-100 p-3"
                >
                  <div>
                    <p className="w-max font-semibold">
                      Subject: {convo.subject}
                    </p>
                    <p className="text-sm">
                      Created At: {new Date(convo.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-end p-2">
                    <Download
                      onClick={() => handleClick(convo.id)}
                      key={convo.id}
                      className="m-2 cursor-pointer rounded-md hover:bg-gray-300"
                    ></Download>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
