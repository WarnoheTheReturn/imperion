


function Card({ title = "None", description = "None", ...props } : { title?: string , description?: string , [key: string]: any }) {

    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            <p className="card-description">{description}</p>
            {props.children}
        </div>
    );
}

export default Card;