import { Box, Text, TextField, Image, Button, Icon } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { useRouter } from 'next/router';
import { createClient } from "@supabase/supabase-js";
import { ButtonSendSticker } from '../src/componentes/ButtonSendSticker';

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function mensagemTempoReal(adicionaMensagem) {
  return supabaseClient
      .from('mensagens')
      .on('INSERT', (respostaLive) => {
          adicionaMensagem(respostaLive.new);

      })
      .subscribe();
}

export default function ChatPage() {
  // Sua lógica vai aqui
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  /* console.log('usurarioLogado', usuarioLogado);
  console.log('roteamento.query', roteamento.query.username); */
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
  //const [loading, setLoading] = useState(true);

  React.useEffect(()=>{
    supabaseClient
    .from('mensagens')
    .select('*')
    .order('id', {ascending: false})
    .then(({data }) => {
        console.log('Dados da consulta:', data);
        setListaDeMensagens(data);
        //setLoading(false);

    });

    mensagemTempoReal((novaMensagem) => {
        //handleNovaMensagem(novaMensagem)
        setListaDeMensagens((valorAtualdaLista) => {
          return [
            novaMensagem, 
            ...valorAtualdaLista,
          ]          
        });
    });
    return () => {
      subscription.unsubscribe();
    }
  }, []);

  /*
    // Usuário
    - Usuário digita no campo textarea
    -apertar enter para enviar
    - tem que adcionar o texto na listagem

    // Dev
    - [X] Campo criado
    - [ ] Vamos usar o onChange usar o useState (ter if pra caso seja enter para limpar a variável)
    - [ ] Lista de mensagem
    */

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      //id: listaDeMensagens.length + 1,
      de: usuarioLogado,
      texto: novaMensagem,
    };

    supabaseClient
    .from('mensagens')
    .insert([
        mensagem
    ])
     .then(({ data })=>{
        //console.log()
        /*setListaDeMensagens([
            data[0], 
            ...listaDeMensagens
        ]);*/

    }); 
    
    setMensagem('');
  }

  function handleDeletaMensagem(mensagemAtual) {
    supabaseClient
      .from("mensagens")
      .delete()
      .match({ id: mensagemAtual.id })
      .then(({ data }) => {
        const listaDeMensagensFiltrada = listaDeMensagens.filter((mensagem) => {
          return mensagem.id != data[0].id;
        });
        setListaDeMensagens(listaDeMensagensFiltrada);
      });
  }
  // ./Sua lógica vai aqui
  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={listaDeMensagens} 
          //atualizaListaMsgs={setListaDeMensagens} 
          handleDeletaMensagem={handleDeletaMensagem}
          />
          {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker
                onStickerClick={(sticker)=> {
                  handleNovaMensagem(':sticker:' + sticker);

                }}
            />
            <Button
              disabled={!mensagem?.length} // botão desativado se não houver mensagempara envio
              onClick={(event) => {
                handleNovaMensagem(mensagem);
              }}
              type="submit"
              label="Send"              
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
              styleSheet={{
                width: "10%",
                border: "1",
                resize: "none",
                height: "100%",
                justifyContent: "center",
                borderRadius: "8px",
                padding: "13px 8px",
                paddingTop: "15px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginBottom: "5px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  console.log(props);

  const handleDeletaMensagem = props.handleDeletaMensagem;

  /* function deleteMensagemComId(idMensagem){
    const novaListaMsg = props.mensagens.filter((mensagem)=> mensagem.id != idMensagem);
    props.atualizaListaMsgs(novaListaMsg);
    
  } */
  return (
    <Box
      tag="ul"
      styleSheet={{
        //hidden: "scroll",
        overflow: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />

              <Icon
                onClick={(event) => {
                  //console.log("clicou: ", mensagem);
                  event.preventDefault();
                  handleDeletaMensagem(mensagem);
                }}
                label="Icon Component"
                name="FaTrash"
                styleSheet={{
                  float: "right",
                  marginRight: "1em",
                }}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
              </Text>
            </Box>
            {/* [ Declarativo] */}
            {/*mensagem.texto.startsWith(':sticker:').toString()*/}
            {mensagem.texto.startsWith(':sticker:')
              ? (
                  <Image src={mensagem.texto.replace(':sticker:', '')}/>
              )
              : (
                  mensagem.texto
              )
            }
          </Text>
        );
      })}
    </Box>
  );
}
