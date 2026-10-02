// Renders one or more schema.org objects as JSON-LD script tags
export default function JsonLd({ data }) {
    const list = (Array.isArray(data) ? data : [data]).filter(Boolean)
    return list.map((d, i) => (
        <script
            key={i}
            type="application/ld+json"
            // escape "<" so content can never close the script tag
            dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }}
        />
    ))
}
