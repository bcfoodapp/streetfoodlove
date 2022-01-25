import { Container, Card } from "semantic-ui-react"

const VendorDashBoard: React.FC = () => {
  return (
    <Container>
      <Card>
        <Image src='/images/avatar/large/daniel.jpg' wrapped ui={false} />
        <Card.Content>
          <Card.Header>Daniel</Card.Header>
          <Card.Meta>Joined in 2016</Card.Meta>
          <Card.Description>
            Daniel is a comedian living in Nashville.
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='user' />
            10 Friends
          </a>
        </Card.Content>
      </Card>
    </Container>
  )
}

export default VendorDashBoard