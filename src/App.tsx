import React, { useEffect, useRef, useState } from 'react';
import { DreamSceneManager, InteractionTarget } from './game/sceneManager';
import { gameState, GameState } from './game/gameState';
import { soundEngine } from './game/audio';
import { WorldId, NPC } from './types/game';

// Components
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { CottageModal } from './components/CottageModal';
import { WardrobeModal } from './components/WardrobeModal';
import { PetsModal } from './components/PetsModal';
import { GardeningModal } from './components/GardeningModal';
import { JobsModal } from './components/JobsModal';
import { MinigamesModal } from './components/MinigamesModal';
import { ShopModal } from './components/ShopModal';
import { WorldMapModal } from './components/WorldMapModal';
import { CameraModal } from './components/CameraModal';
import { JukeboxModal } from './components/JukeboxModal';
import { MailboxModal } from './components/MailboxModal';
import { AchievementsModal } from './components/AchievementsModal';
import { DiaryModal } from './components/DiaryModal';
import { DialogueModal } from './components/DialogueModal';
import { SettingsModal } from './components/SettingsModal';
import { CreditsModal } from './components/CreditsModal';
import { DownloadModal } from './components/DownloadModal';
import { VirtualJoystick } from './components/VirtualJoystick';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<DreamSceneManager | null>(null);

  // Game UI State
  const [appState, setAppState] = useState<GameState>(gameState.getState());
  const [isTitleScreen, setIsTitleScreen] = useState<boolean>(true);
  const [nearInteraction, setNearInteraction] = useState<InteractionTarget | null>(null);

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    | 'cottage'
    | 'wardrobe'
    | 'pets'
    | 'gardening'
    | 'jobs'
    | 'minigames'
    | 'shop'
    | 'map'
    | 'camera'
    | 'jukebox'
    | 'mailbox'
    | 'achievements'
    | 'diary'
    | 'settings'
    | 'credits'
    | 'download'
    | null
  >(null);

  const [activeNpcDialogue, setActiveNpcDialogue] = useState<NPC | null>(null);

  // Keyboard held keys
  const keysHeld = useRef<Record<string, boolean>>({});

  useEffect(() => {
    // Subscribe to reactive gameState
    const unsubscribe = gameState.subscribe((updated) => {
      setAppState({ ...updated });
    });
    return unsubscribe;
  }, []);

  // Initialize 3D Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const manager = new DreamSceneManager(mountRef.current);
    sceneManagerRef.current = manager;
    manager.isTitleScreen = true;

    manager.onNearInteraction = (target) => {
      setNearInteraction(target);
    };

    // Keyboard Input Listeners
    const updateMovement = () => {
      if (!sceneManagerRef.current || sceneManagerRef.current.isTitleScreen) return;

      let x = 0;
      let z = 0;

      if (keysHeld.current['KeyW'] || keysHeld.current['ArrowUp']) z -= 1;
      if (keysHeld.current['KeyS'] || keysHeld.current['ArrowDown']) z += 1;
      if (keysHeld.current['KeyA'] || keysHeld.current['ArrowLeft']) x -= 1;
      if (keysHeld.current['KeyD'] || keysHeld.current['ArrowRight']) x += 1;

      sceneManagerRef.current.setMoveInput(x, z);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      keysHeld.current[e.code] = true;

      if (sceneManagerRef.current?.isTitleScreen) {
        if (e.code === 'Space' || e.code === 'Enter') {
          handlePlayGame();
        }
        return;
      }

      if (e.code === 'Space') {
        sceneManagerRef.current?.triggerJump();
      } else if (e.code === 'KeyE') {
        handleExecuteInteraction();
      } else if (e.code === 'Tab') {
        e.preventDefault();
        setActiveModal((m) => (m === 'wardrobe' ? null : 'wardrobe'));
      } else if (e.code === 'Escape') {
        setActiveModal((m) => (m === null ? 'settings' : null));
        setActiveNpcDialogue(null);
      }

      updateMovement();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysHeld.current[e.code] = false;
      updateMovement();
    };

    const handleBlur = () => {
      keysHeld.current = {};
      sceneManagerRef.current?.setMoveInput(0, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      manager.destroy();
      sceneManagerRef.current = null;
    };
  }, []);

  const handlePlayGame = () => {
    setIsTitleScreen(false);
    if (sceneManagerRef.current) {
      sceneManagerRef.current.isTitleScreen = false;
    }
    soundEngine.startBgm('dreamy');
  };

  const handleWarp = (worldId: WorldId) => {
    gameState.setWorld(worldId);
    sceneManagerRef.current?.loadWorld(worldId);
    sceneManagerRef.current?.rebuildPlayer();
  };

  const handleExecuteInteraction = () => {
    if (!nearInteraction) return;

    if (nearInteraction.type === 'npc' && nearInteraction.id) {
      const npc = appState.npcs.find((n) => n.id === nearInteraction.id);
      if (npc) {
        setActiveNpcDialogue(npc);
        soundEngine.playUiPop();
      }
    } else if (nearInteraction.type === 'garden') {
      setActiveModal('gardening');
      soundEngine.playUiPop();
    } else if (nearInteraction.type === 'cottage_door') {
      const nextWorld: WorldId = appState.currentWorld === 'cottage_interior' ? 'strawberry_village' : 'cottage_interior';
      handleWarp(nextWorld);
      soundEngine.playUiPop();
    } else if (nearInteraction.type === 'music_box') {
      gameState.windMusicBox();
    } else if (nearInteraction.type === 'key') {
      gameState.unlockForgottenRoomKey();
    } else if (nearInteraction.type === 'portal' && nearInteraction.id) {
      handleWarp(nearInteraction.id as WorldId);
    } else if (nearInteraction.type === 'dreamie') {
      gameState.petDreamie(appState.activeCompanionId);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-pink-100 font-['Fredoka'] select-none">
      {/* Three.js Isolated Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 pointer-events-auto" />

      {/* Title Screen Overlay */}
      {isTitleScreen && (
        <TitleScreen
          onPlay={handlePlayGame}
          onOpenDressUp={() => setActiveModal('wardrobe')}
          onOpenPets={() => setActiveModal('pets')}
          onOpenShop={() => setActiveModal('shop')}
          onOpenSettings={() => setActiveModal('settings')}
          onOpenCredits={() => setActiveModal('credits')}
          onOpenDownload={() => setActiveModal('download')}
        />
      )}

      {/* In-Game Low-Occlusion HUD Overlay */}
      {!isTitleScreen && (
        <>
          <GameHUD
            state={appState}
            nearInteraction={nearInteraction}
            onInteract={handleExecuteInteraction}
            onOpenCottage={() => setActiveModal('cottage')}
            onOpenWardrobe={() => setActiveModal('wardrobe')}
            onOpenPets={() => setActiveModal('pets')}
            onOpenGardening={() => setActiveModal('gardening')}
            onOpenJobs={() => setActiveModal('jobs')}
            onOpenMinigames={() => setActiveModal('minigames')}
            onOpenShop={() => setActiveModal('shop')}
            onOpenMap={() => setActiveModal('map')}
            onOpenCamera={() => setActiveModal('camera')}
            onOpenJukebox={() => setActiveModal('jukebox')}
            onOpenMailbox={() => setActiveModal('mailbox')}
            onOpenAchievements={() => setActiveModal('achievements')}
            onOpenDiary={() => setActiveModal('diary')}
            onOpenSettings={() => setActiveModal('settings')}
            onReturnToTitle={() => {
              setIsTitleScreen(true);
              if (sceneManagerRef.current) {
                sceneManagerRef.current.isTitleScreen = true;
              }
            }}
          />

          {/* Touch Joystick on Mobile */}
          <VirtualJoystick
            onMove={(x, z) => sceneManagerRef.current?.setMoveInput(x, z)}
            onJump={() => sceneManagerRef.current?.triggerJump()}
            onInteract={handleExecuteInteraction}
            canInteract={nearInteraction !== null}
            interactLabel={nearInteraction?.label}
          />
        </>
      )}

      {/* Modals */}
      {activeModal === 'cottage' && (
        <CottageModal
          onClose={() => {
            setActiveModal(null);
            sceneManagerRef.current?.updatePlacedFurniture();
          }}
          state={appState}
        />
      )}

      {activeModal === 'wardrobe' && (
        <WardrobeModal
          onClose={() => {
            setActiveModal(null);
            sceneManagerRef.current?.rebuildPlayer();
          }}
          state={appState}
          onRefreshPlayerModel={() => sceneManagerRef.current?.rebuildPlayer()}
        />
      )}

      {activeModal === 'pets' && (
        <PetsModal
          onClose={() => {
            setActiveModal(null);
            sceneManagerRef.current?.rebuildCompanion();
          }}
          state={appState}
          onRefreshCompanion={() => sceneManagerRef.current?.rebuildCompanion()}
        />
      )}

      {activeModal === 'gardening' && (
        <GardeningModal
          onClose={() => {
            setActiveModal(null);
            sceneManagerRef.current?.updateGardenPlots();
          }}
          state={appState}
          onRefreshPlots={() => sceneManagerRef.current?.updateGardenPlots()}
        />
      )}

      {activeModal === 'jobs' && (
        <JobsModal onClose={() => setActiveModal(null)} state={appState} />
      )}

      {activeModal === 'minigames' && (
        <MinigamesModal onClose={() => setActiveModal(null)} state={appState} />
      )}

      {activeModal === 'shop' && (
        <ShopModal onClose={() => setActiveModal(null)} state={appState} />
      )}

      {activeModal === 'map' && (
        <WorldMapModal
          onClose={() => setActiveModal(null)}
          state={appState}
          onWarpToWorld={(worldId) => handleWarp(worldId)}
        />
      )}

      {activeModal === 'camera' && (
        <CameraModal onClose={() => setActiveModal(null)} state={appState} />
      )}

      {activeModal === 'jukebox' && (
        <JukeboxModal onClose={() => setActiveModal(null)} state={appState} />
      )}

      {activeModal === 'mailbox' && (
        <MailboxModal onClose={() => setActiveModal(null)} state={appState} />
      )}

      {activeModal === 'achievements' && (
        <AchievementsModal onClose={() => setActiveModal(null)} state={appState} />
      )}

      {activeModal === 'diary' && (
        <DiaryModal onClose={() => setActiveModal(null)} state={appState} />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          onClose={() => setActiveModal(null)}
          onOpenDownload={() => setActiveModal('download')}
          onReturnToTitle={() => {
            setIsTitleScreen(true);
            if (sceneManagerRef.current) {
              sceneManagerRef.current.isTitleScreen = true;
            }
          }}
        />
      )}

      {activeModal === 'credits' && (
        <CreditsModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'download' && (
        <DownloadModal onClose={() => setActiveModal(null)} />
      )}

      {/* NPC Dialogue Modal */}
      {activeNpcDialogue && (
        <DialogueModal
          npc={activeNpcDialogue}
          onClose={() => setActiveNpcDialogue(null)}
          state={appState}
        />
      )}
    </div>
  );
}
