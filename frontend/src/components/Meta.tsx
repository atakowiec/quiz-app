import {Helmet} from "react-helmet";

interface MetaProps {
    title: string;
}

const Meta = (props: MetaProps) => {
  return (
    <Helmet>
        <meta charSet="utf-8" />
        <title>{props.title}</title>
    </Helmet>
  )
}

export default Meta