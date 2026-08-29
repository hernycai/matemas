export default function ButtonFloat({ onClick, children, ...props }) {
    return (
        <button
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
}