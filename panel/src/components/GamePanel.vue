<script setup lang="ts">
import { ref } from 'vue';
import { NSpace, NSelect, NButton, NDivider, NCard } from 'naive-ui';
import { GameState, Player } from '@/interfaces/GameState';
import StorageDisplayer from '@/components/StorageDisplayer.vue';
import ItemEntryDiv from '@/components/ItemEntryDiv.vue';
import { getSpecieColor, getSpecieZhName } from '@/interfaces/GameConfig';
import { socket } from '@/utils/connect';

const props = defineProps<{
  gameState: GameState;
  username: string;
  handleTradePanel: () => void;
  selectedPlayer: string;
  handleSelectPlayer: (playerId: string) => void;
  handleExchangePanel: () => void;
  exitGame: () => void;
}>();

const selectedPlayer = ref(props.selectedPlayer);

const getPlayer = () => {
  return props.gameState.players.find(player => player.user_id === props.selectedPlayer) || null;
};

const getMe = () => {
  return props.gameState.players.find(player => player.user_id === props.username) || null;
};

const getPlayerSelectOptions = () => {

  return props.gameState.players.map(player => ({
    label: player.specie + (player.user_id === props.username ? ' (You)' : ''),
    value: player.user_id, 
    style: { color: getSpecieColor(player.specie), fontWeight: 'bold' }
  }));
};
const agreeToNextStage = () => {
  console.log(props.gameState.room_name);
  socket.emit('agree', { username: props.username, room_name: props.gameState.room_name });
};
const disagreeToNextStage = () => {
  socket.emit('disagree', { username: props.username, room_name: props.gameState.room_name });
};

</script>

<template>
  <div class="">
    <n-card vertical align="center" justify="center" class="game-panel" hoverable>
      <div class="game-info">轮次: {{ gameState.current_round }} ，阶段: {{ gameState.stage }}</div>
      <n-divider />
      <n-select 
        v-model:value="selectedPlayer"
        v-on:update:value="props.handleSelectPlayer(selectedPlayer)"
        :options="getPlayerSelectOptions()" 
        placeholder="Choose a player" 
      />
      <div v-if="getPlayer() !== null" class="player-info">
        <div class="player-basic-info">
          <div class="player-specie" :style="{ fontWeight: 'bold', color: getSpecieColor(getPlayer()!.specie) }">{{ getSpecieZhName(getPlayer()!.specie) }}</div>
          <div class="player-agreed" :style="{ fontWeight: 'bold', color: getPlayer()!.agreed ? 'green' : 'red' }">{{ getPlayer()!.agreed ? '已动完' : '没动完' }}</div>
        </div>
        <div class="storage-container">
          <template v-for="(item_count, item_id) in getPlayer()!.storage">
            <ItemEntryDiv :item="item_id as string" :count="item_count" :iconWidth="60" :iconHeight="60" v-if="item_count > 0"/>
          </template>
        </div>
        <div class="donation-item-container">
          <template v-for="(item_count, item_id) in getPlayer()!.donation_items">
            <ItemEntryDiv :item="item_id as string + 'Donation'" :count="item_count" :iconWidth="60" :iconHeight="60" v-if="item_count > 0"/>
          </template>
        </div>
      </div>
      <n-divider />
      <div class="player-action">
        <template v-if="getMe() !== null">
          <template v-if="gameState.stage === 'trading' || gameState.stage === 'production'" >
            <template v-if="getMe()!.agreed === false">
              <n-button type="primary" @click="agreeToNextStage">宣布已动完</n-button>
            </template>
            <template v-else>
              <n-button type="info" @click="disagreeToNextStage">宣布未动完</n-button>
            </template>
          </template>
          <n-button type="warning" @click="props.handleTradePanel" v-if="gameState.stage === 'trading'">交易</n-button>
          <n-button type="warning" @click="props.handleExchangePanel" v-if="gameState.stage === 'trading'">自由转换</n-button>
          <n-button type="error" @click="props.exitGame">退出</n-button>
        </template>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.game-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 250px;
  /* padding: 100px; */
}
.game-info {
  font-size: 1.2rem;
  font-weight: bold;
}
.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.player-basic-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.player-basic-info > * {
  margin: 5px;
}
.storage-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}


.donation-item-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.player-action {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.player-action > * {
  margin: 10px;
}
</style>
