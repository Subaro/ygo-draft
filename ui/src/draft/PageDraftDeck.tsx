import React, {useState} from "react";
import {Card, Deck} from "../api/CardModel";
import {useRandomCards} from "../api/hooks/useCards";
import DeckViewer from "../deck/DeckViewer";
import {Alert, Button, Modal, Spinner} from "react-bootstrap";
import MultiCardDraftArea from "./MultiCardDraftArea";
import {YgoQueryClient} from "../index";
import {DraftStages} from "./DeckDraftWizard";
import {usePrompt} from "../core/hooks/usePromptBlocker";

const componentRandomQueryID = "draft_generator"
const emptyDeck: Deck = {cards: []}

export type PageDraftDeckProps = {
    isMainDraft: boolean
    deck: Deck
    setDeck: React.Dispatch<React.SetStateAction<Deck>>
    setCurrentStage: React.Dispatch<React.SetStateAction<DraftStages>>
    draftSize: number
    maxRounds: number
}

function PageDraftDeck(props: PageDraftDeckProps) {
    const [draftDeck, setDraftDeck] = useState({cards: []} as Deck)
    const [currentDraftRound, setCurrentDraftRound] = useState(1)
    const [finished, setFinished] = useState(false)

    const {data, isLoading, error} = useRandomCards(componentRandomQueryID, props.draftSize, {
        enabled: true,
        staleTime: Infinity
    })

    let draftCard = function (draftedCard: Card): void {
        setDraftDeck(emptyDeck)
        addCardToCurrentDeck(props.deck, props.setDeck, draftedCard)

        let newRound = currentDraftRound + 1
        setCurrentDraftRound(newRound)

        if (newRound > props.maxRounds) {
            setFinished(true)
        }

        YgoQueryClient.removeQueries(["random", componentRandomQueryID])
    }

    // Abort modal used to verify the abort process.
    const [showAbortDialog, setShowAbortDialog] = useState(false)
    const handleCloseAbortDraftProcessModal = () => setShowAbortDialog(false)
    let handleAbortDraftProcess = function (): void {
        props.setDeck({cards: []} as Deck)
        setDraftDeck({cards: []} as Deck)
        setCurrentDraftRound(0)
        YgoQueryClient.removeQueries(["random", componentRandomQueryID])
        props.setCurrentStage(DraftStages.Settings)
        setShowAbortDialog(false)
    }

    let handleNextClick = function (): void {
        setDraftDeck({cards: []} as Deck)
        setCurrentDraftRound(1)
        setFinished(false)
        YgoQueryClient.removeQueries(["random", componentRandomQueryID])
        props.setCurrentStage(props.isMainDraft ? DraftStages.DraftExtra : DraftStages.DeckOverview)
    }

    let body;
    if (draftDeck.cards.length === 0) {
        if (isLoading) {
            body = <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading Deck...</span>
            </Spinner>
        } else if (error) {
            body = <Alert variant={"danger"}>
                Could not load deck!
            </Alert>
        } else if (data) {
            setDraftDeck(data)
        }
    }

    const handleShow = () => setShowAbortDialog(true);

    usePrompt("Your unfinished deck is going to be deleted when leaving the page. Are you sure you want to leave?", true);

    return <>
        {body}
        {!finished ? <><MultiCardDraftArea name={"Draft Area"} maxRound={props.maxRounds} draftRound={currentDraftRound} cards={draftDeck.cards}
                                           draftAction={draftCard}/><br/></> : <></>}
        <p className={"text-3xl"}>Current Deck</p>
        <DeckViewer deck={props.deck}/>
        <Modal show={showAbortDialog} onHide={handleCloseAbortDraftProcessModal}>
            <Modal.Header closeButton>
                <Modal.Title>Abort Draft Process?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your currently drafted deck is going to be deleted.</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAbortDraftProcessModal}>
                    No
                </Button>
                <Button variant="danger" onClick={handleAbortDraftProcess}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>

        <div className={"flex place-content-end"}>
            <Button className={"ml-4 object-center"}
                    variant="danger"
                    disabled={isLoading}
                    onClick={() => !isLoading ? handleShow() : null}>
                Abort Draft
            </Button>
            <Button className={"ml-4 object-center object-right"}
                    variant="primary"
                    disabled={isLoading || (currentDraftRound <= props.maxRounds)}
                    onClick={() => !isLoading ? handleNextClick() : null}>
                Next
            </Button>
        </div>
        <br/>
    </>
}

function addCardToCurrentDeck(currentDeck: Deck, setCurrentDeck: React.Dispatch<React.SetStateAction<Deck>>, newCard: Card) {
    let newDeck = {cards: currentDeck.cards} as Deck
    newDeck.cards.push(newCard)
    setCurrentDeck(newDeck)
}

export default PageDraftDeck