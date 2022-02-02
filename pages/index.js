import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import React from "react";
import {useRouter} from 'next/router';
import appConfig from "../config.json";



function Titulo(props) {
  const Tag = props.tag || 'h1';
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals["000"]};
          font-size: 24px;
          font-wieght: 600;
        }
      `}</style>
    </>
  );
}

// Componente React
/*function HomePage() {
    // JSX
    return (
    <div>
        <GlobalStyle/>
        <Titulo tag="h2">Boas vindas de Volta!</Titulo>
        <h2>Discord - Alura Matrix</h2>
        
    </div>
    )
  }*/

// export default HomePage

export default function PaginaInicial() {
  //const username = "PauloHenriq19";

  //usuário
  const [username, setUsername] = React.useState('')
  const roteamento = useRouter();
  const userImage = 'https://media.istockphoto.com/vectors/funny-cartoon-brain-character-with-facepalm-gesture-vector-id1261650074?s=612x612';
  const [githubData, setGithubData] = React.useState('');
  

  // trazer dados da api do github 
  fetch(`https://api.github.com/users/${username}`)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                setGithubData(data)
            })

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[100],
          backgroundImage:
            "url(https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (infosDoEvento){
              infosDoEvento.preventDefault();
              console.log('Alguém submeteu o form');
              roteamento.push(`/chat?username=${username}`);

            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Titulo tag="h2">Welcome!</Titulo>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

          {/* <input
          type="text"
          value={username}
          onChange={function (event){
            //onde está o valor?
            const valor = event.target.value;
            // trocar o valor da variavel
            //através do React e avise quem precisa
            setUsername(valor);
          }}
          /> */} 

          <TextField
              value={username}
              name='nomeUsuario'
              placeholder='Digite o nome do usuário'
              onChange={function (event){
              /* sinal para React não anular o objeto de evento */ 
              event.persist(); 

              //onde está o valor?
              const valor = event.target.value;
              // trocar o valor da variavel
              //através do React e avise quem precisa
              setUsername(valor);
              /* if(valor.length > 2) {
                setUserImage(`https://github.com/${valor}.png`)
              } else {
                setUserImage('https://www.istockphoto.com/br/vetor/erro-404-como-laptop-com-emoji-morto-desenhos-animados-plana-m%C3%ADnima-tend%C3%AAncia-gm1011988208-272646277')
              } */
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              disabled={username?.length <=2}
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >
              {githubData.name}
            </Text>
            <br />
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px',
              }}
              //src={userImage}
              src={username.length > 2 ? `https://github.com/${username}.png` : userImage}
            />
           
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {username}
            </Text>
            <br />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >
              {githubData.followers} followers
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
