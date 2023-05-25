export function FormGroup(props: React.ComponentPropsWithoutRef<"div">) {
    return <div {...props} className="gap-1 flex flex-col">
        {props.children}

    </div>
}