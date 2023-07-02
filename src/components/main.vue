<template>
  <div class="main">
    <div class="content-container">
      <div class="section content-title-group">
        <h1 class="title">Bardic Works</h1>
      </div>
    </div>

    <div>
      <TabCard :tabs="data.tabs" :initialTab="data.initialTab">
        <template v-slot:tab-head-inspo>
          <div @click="defaultDisplay = true">Inspire</div>
        </template>

        <template v-slot:tab-panel-inspo>
          <div class="default-desc" v-if="data.defaultDisplay.value == true">
            <p>Inspire your comrades or yourself with Bardic Inspiration!</p>
          </div>
          <div v-else>
            <div class="inspo-display" v-if="data.inspoDisplay.value == true">
              <p class="tab-desc-inspo">{{ data.inspo.value.description }}</p>
              <p class="source">{{ fullSource }}</p>
            </div>
          </div>
          <div class="options">
            <a class="link" @click="resolveOptions()">Options</a>
          </div>
          <div class="options-display" v-if="data.options.value == true">
            <div class="row">
                <div class="column">
                <label class="label-container">
                  <input type="checkbox" for="opt-self" id="self" value="Self" v-model="checkedTarget" />
                  <span class="checkmark"></span><span class="label-text">Inspire Self</span>
                </label>
                </div>
              <div class="column">
                <label class="label-container">
                  <input type="checkbox" for="opt-other" id="others" value="Others" v-model="checkedTarget" />
                  <span class="checkmark"></span><span class="label-text">Inspire Others</span>
                </label>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <label class="label-container">
                  <input type="checkbox" for="opt-humor" id="humor" value="Humorous" v-model="checkedFilter" />
                  <span class="checkmark"></span><span class="label-text">Humorous Inspiration</span>
                </label>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <label class="label-container">
                  <input type="checkbox" for="opt-bold" id="bold" value="Bold" v-model="checkedFilter" />
                  <span class="checkmark"></span><span class="label-text">Bold Inspiration</span>
                </label>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <label class="label-container">
                  <input type="checkbox" for="opt-heart" id="heart" value="Heartening" v-model="checkedFilter" />
                  <span class="checkmark"></span><span class="label-text">Heartening Inspiration</span>
                </label>
              </div>
            </div>
          </div>
          <div class="inspire-button">
            <a class="link" @click="inspireMe()">Click to Inspire!</a>
          </div>
        </template>

        <template v-slot:tab-head-insult>
          <div @click="data.defaultDisplay.value = true">Insult</div>
        </template>

        <template v-slot:tab-panel-insult>
          <p class="default-desc" v-if="data.defaultDisplay.value === true">Bring your enemies down a size with Vicious Mockery!</p>
          <p class="tab-desc-insult" v-else><b>{{ data.insult.value.description }}</b></p>
          <div class="mock-button">
            <a class="link" @click="mockMe()">Click to Mock!</a>
          </div>
        </template>
      </TabCard>
    </div>

  </div>
</template>

<script setup>
import { onBeforeMount, computed, ref } from "vue";
import { myInspos } from "../shared/inspos.js";
import { myInsults } from "../shared/mockeries.js";
import TabCard from "../components/TabCard.vue";

let data = {
      insults: ref([]),
      inspos: ref([]),
      randomNum: ref(0),
      insult: ref({"id": 'default', "description": 'no insult loaded'}),
      inspo: ref({"id": 'default', "description": 'no inspiring quote loaded'}),
      defaultDisplay: ref(true),
      inspoDisplay: ref(false),
      options: ref(false),
      initialTab: 'inspo',
      tabs: ['inspo', 'insult'],
      checkedTarget: ref([]),
      checkedFilter: ref([]),
      filteredInspos: ref([])
    };



onBeforeMount(() => {
  console.log('inside onBeforeMount');
  loadInsults();
  loadInspos();
});

const fullSource = computed(() => {
  if (data.inspo.value)
  {
    if (data.inspo.value.source) {
      return `— ${data.inspo.value.source}`
    }
  }

  return '';
});

const recipientFilter = computed(() => {
  if (data.checkedTarget.value)
  {
      var targetFilter = [];
      //create target filter
      if(data.checkedTarget.value.length > 0)
      {
        data.checkedTarget.value.forEach(function(rec) {
          targetFilter.push({
            recipient: rec
          });
        })
      }
      return targetFilter;
  }
  else return [];
});

const typeFilter = computed(() => {
  if (data.checkedFilter.value)
  {
    var typeFilter = [];
  
    //create type filter
    if (data.checkedFilter.value.length > 0) 
    {
      data.checkedFilter.value.forEach(function(type) {
        typeFilter.push({
          type: type
        });
      })
    }
    return typeFilter;
  }
  else return [];
});

async function getInsults() {
      return new Promise(resolve => {
        resolve(myInsults);
      });
    };

async function loadInsults() {
      data.insults.value = [];
      await getInsults().then((value) => {data.insults.value.push(...value)});
};

async function getInspos() {
      return new Promise(resolve => {
        resolve(myInspos);
      })
    };

async function loadInspos() {
      await getInspos().then((value) => {data.inspos.value.push(...value)});
    };

async function inspireMe() {
      data.defaultDisplay.value = false;
      data.inspoDisplay.value = true;
      data.options.value = false;

      if(data.checkedTarget.value.length > 0 && data.checkedFilter.value.length > 0)
      {
        buildFilterArray();
        data.randomNum.value = Math.floor(Math.random() * data.filteredInspos.value.length);
        data.inspo.value = data.filteredInspos.value[data.randomNum.value];
      }
      else
      {
        data.randomNum.value = Math.floor(Math.random() * data.inspos.value.length);
        data.inspo.value = data.inspos.value[data.randomNum.value];
      }
    };
    
async function mockMe() {
      data.defaultDisplay.value = false;
      data.randomNum.value = Math.floor(Math.random() * data.insults.value.length);
      data.insult.value = data.insults.value[data.randomNum.value];
    };

function clearAll() {
      data.defaultDisplay.value = false;
      data.inspoDisplay.value = false;
    };

function resolveOptions() {
      clearAll();

      if (data.options.value == true) {
        data.options.value = false;
        data.defaultDisplay.value = true;
      }
      else {
        data.options.value = true;
        data.defaultDisplay.value = false;
      }
    };

function buildFilterArray() {
      data.filteredInspos.value = [];

      var targetFilter = recipientFilter.value;
      var typeFilter = typeFilter.value;

      //create new array from full list filtering above two
      if(data.targetFilter.length > 0 && data.typeFilter.length > 0)
      {
        data.filteredInspos.value = data.inspos.value.filter(({type, recipient}) => targetFilter.some(x => x.recipient === recipient) && typeFilter.some(y => y.type === type));
      }
    };
</script>
