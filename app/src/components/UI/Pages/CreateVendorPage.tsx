import { Container, Form, Header } from "semantic-ui-react"
import HeaderBar from "../Molecules/HeaderBar/HeaderBar"
import styles from './createvendorpage.module.css'

const CreateVendorPage: React.FC = () => {
  return (
    <Container className={styles.wrapper}>
      <HeaderBar logout />
      <Header as={"h2"}>Create New Vendor Page</Header>
      <Form>
        <Form.Input 
          fluid
          required
        />
        <Form.Input 
          fluid
          required
          
        />
        <Form.Input 
          fluid
          required
          
        />
      </Form>
    </Container>
  )
}

export default CreateVendorPage