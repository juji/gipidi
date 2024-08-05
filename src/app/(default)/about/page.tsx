import { Page } from "@/components/page"

export default function About(){

  return <Page title="About">
    <br />
    <br />
    GiPiDi' is a GPT client.
    <br />
    <small>Don't know what else to say, really..</small>

    <br />
    <br />
    Bug Report: <a 
      style={{
        textDecoration: 'underline'
      }}
    target="_blank"
    rel="noreferrer noopener"
    href="https://github.com/juji/gipidi/issues">Github</a>
  </Page>

}