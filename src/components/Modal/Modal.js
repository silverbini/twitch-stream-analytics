import './Modal.css'

const Modal = ({ children }) => {
    return <div className="background">
        {children}
    </div>
}

export default Modal