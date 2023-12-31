import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "./components/ui/button"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { converterSchema } from "./lib/validation"
import axios from "axios"
import { useState } from "react"
import { YouTubeGetID } from "./lib/utils"

const FormConverter = () => {
  const [urlResult, setUrlResult] = useState(null)
  const [youtubeTitle, setYoutubeTitle] = useState(null)
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof converterSchema>>({
    resolver: zodResolver(converterSchema),
    defaultValues: {
      YTLink: "",
    },
  })
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof converterSchema>) {
    const youtubeID = YouTubeGetID(values.YTLink)
    const options = {
        method: 'get',
        url: 'https://youtube-mp36.p.rapidapi.com/dl',
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
          'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        },
        params: {
          id: youtubeID
        }
      }

      axios(options)
      .then(res => {
        setUrlResult(res.data.link)
        setYoutubeTitle(res.data.title)})
      .catch(err => console.log(err))

      form.control._reset()
    }

    
  return (
    <Form {...form}>
      <div className="flex flex-col content-center items-center text-center">
        <img 
        src="public/assets/icons/youtube-to-MP3-icon.png" 
        alt="Logo"
        className="w-40 h-auto" />
        <h1 className="text-3xl font-bold leading-tight tracking-tighter">Youtube MP3 Converter</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField
            control={form.control}
            name="YTLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Convert Youtube videos into MP3s in just a few clicks!</FormLabel>
                <FormControl>
                  <Input 
                  
                  placeholder="Paste a Youtube video URL Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="border-solid border rounded m-2 bg-slate-500 hover:bg-slate-800">Convert</Button>
        </form>
        { urlResult ?
          (
            <>
              <p className="text-bold italic">{youtubeTitle}</p>
              <a target="_blank" rel="noreferrer"
              href={urlResult} className="underline">Download MP3</a>
            </>
          ) : 
          (
            ''
          )
        }
      </div>
    </Form>
  )
}

export default FormConverter